import fs from "node:fs";
import path from "node:path";
import { DatabaseSync, type StatementSync } from "node:sqlite";

const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(process.cwd(), "storage");

export const UPLOAD_DIR = path.join(DATA_DIR, "photos");
export const THUMB_DIR = path.join(DATA_DIR, "thumbs");

for (const dir of [DATA_DIR, UPLOAD_DIR, THUMB_DIR]) {
  fs.mkdirSync(dir, { recursive: true });
}

const globalForDb = globalThis as unknown as { __db?: DatabaseSync };

function init(): DatabaseSync {
  const db = new DatabaseSync(path.join(DATA_DIR, "app.db"));
  db.exec("PRAGMA journal_mode = WAL");
  db.exec("PRAGMA busy_timeout = 5000");
  db.exec("PRAGMA foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS photographers (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      studio TEXT,
      locale TEXT NOT NULL DEFAULT 'tr',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS galleries (
      id TEXT PRIMARY KEY,
      photographer_id TEXT NOT NULL REFERENCES photographers(id) ON DELETE CASCADE,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      description TEXT,
      client_name TEXT NOT NULL,
      client_email TEXT,
      access_code TEXT,
      min_selections INTEGER,
      max_selections INTEGER,
      allow_notes INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'draft',
      cover_photo_id TEXT,
      created_at TEXT NOT NULL,
      submitted_at TEXT,
      reopened_at TEXT
    );

    CREATE TABLE IF NOT EXISTS photos (
      id TEXT PRIMARY KEY,
      gallery_id TEXT NOT NULL REFERENCES galleries(id) ON DELETE CASCADE,
      original_name TEXT NOT NULL,
      base_name TEXT NOT NULL,
      stored_name TEXT NOT NULL,
      thumb_name TEXT NOT NULL,
      mime TEXT NOT NULL,
      bytes INTEGER NOT NULL,
      width INTEGER,
      height INTEGER,
      position INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS selections (
      gallery_id TEXT NOT NULL REFERENCES galleries(id) ON DELETE CASCADE,
      photo_id TEXT NOT NULL REFERENCES photos(id) ON DELETE CASCADE,
      note TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (gallery_id, photo_id)
    );

    CREATE INDEX IF NOT EXISTS idx_galleries_photographer ON galleries(photographer_id);
    CREATE INDEX IF NOT EXISTS idx_photos_gallery ON photos(gallery_id, position);
    CREATE INDEX IF NOT EXISTS idx_selections_gallery ON selections(gallery_id);
  `);

  return db;
}

function connection(): DatabaseSync {
  if (!globalForDb.__db) globalForDb.__db = init();
  return globalForDb.__db;
}

type AnyFn = (...args: unknown[]) => unknown;

// node:sqlite hands back rows with a null prototype, which React refuses to
// serialize when a server component passes one to a client component. Copying
// each row into a plain object here spares every call site from remembering.
const toPlainRow = (row: unknown) =>
  row == null ? row : { ...(row as Record<string, unknown>) };

function wrapStatement(statement: StatementSync): StatementSync {
  return new Proxy(statement, {
    get(target, property) {
      const value = Reflect.get(target, property, target) as unknown;
      if (typeof value !== "function") return value;
      const method = (value as AnyFn).bind(target);

      if (property === "get") {
        return (...args: unknown[]) => toPlainRow(method(...args));
      }
      if (property === "all") {
        return (...args: unknown[]) => (method(...args) as unknown[]).map(toPlainRow);
      }
      return method;
    },
  });
}

// Opening SQLite at import time makes every build worker contend for the same
// file lock, so the handle is created on first query instead.
export const db = new Proxy({} as DatabaseSync, {
  get(_target, property) {
    const real = connection();
    const value = Reflect.get(real, property, real) as unknown;
    if (typeof value !== "function") return value;
    const method = (value as AnyFn).bind(real);

    if (property === "prepare") {
      return (...args: unknown[]) => wrapStatement(method(...args) as StatementSync);
    }
    return method;
  },
});
