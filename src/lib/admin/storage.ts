import "server-only";

import { writeFile } from "node:fs/promises";
import path from "node:path";
import type { SectionId } from "./sections";

/**
 * Panelden yapılan değişikliklerin nereye yazılacağı.
 *
 * - **github**: `GITHUB_TOKEN` + `GITHUB_REPO` tanımlıysa içerik dosyası
 *   doğrudan depoya işlenir. Vercel gibi dosya sisteminin salt okunur olduğu
 *   ortamlarda tek yol budur; push, sitenin yeniden yayınlanmasını tetikler.
 * - **local**: Aksi hâlde `content/*.json` dosyasına doğrudan yazılır
 *   (kendi bilgisayarınız ya da kendi sunucunuz).
 */

export type StorageMode = "github" | "local";

export const storageMode: StorageMode =
  process.env.GITHUB_TOKEN && process.env.GITHUB_REPO ? "github" : "local";

export type SaveResult = { ok: boolean; message: string };

const CONTENT_DIR = path.join(process.cwd(), "content");

function fileFor(section: SectionId) {
  return `content/${section}.json`;
}

function serialize(data: unknown) {
  return `${JSON.stringify(data, null, 2)}\n`;
}

async function saveLocally(
  section: SectionId,
  data: unknown,
): Promise<SaveResult> {
  await writeFile(
    path.join(CONTENT_DIR, `${section}.json`),
    serialize(data),
    "utf8",
  );
  return {
    ok: true,
    message:
      "Kaydedildi. Geliştirme sunucusunda değişiklik hemen görünür; " +
      "yayındaki site için yeniden yayınlamanız gerekir.",
  };
}

type GitHubFile = { sha?: string };

async function githubRequest(url: string, init?: RequestInit) {
  return fetch(url, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });
}

async function saveToGitHub(
  section: SectionId,
  data: unknown,
): Promise<SaveResult> {
  const repo = process.env.GITHUB_REPO; // "kullanici/depo"
  const branch = process.env.GITHUB_BRANCH ?? "main";
  const filePath = fileFor(section);
  const base = `https://api.github.com/repos/${repo}/contents/${filePath}`;

  // Mevcut dosyanın sha'sı olmadan güncelleme yapılamaz.
  const current = await githubRequest(`${base}?ref=${encodeURIComponent(branch)}`);
  if (!current.ok && current.status !== 404) {
    return {
      ok: false,
      message: `GitHub dosyayı okuyamadı (${current.status}). Token izinlerini ve GITHUB_REPO değerini kontrol edin.`,
    };
  }
  const existing: GitHubFile = current.ok ? await current.json() : {};

  const response = await githubRequest(base, {
    method: "PUT",
    body: JSON.stringify({
      message: `İçerik güncellendi: ${section} (yönetim paneli)`,
      content: Buffer.from(serialize(data), "utf8").toString("base64"),
      branch,
      ...(existing.sha ? { sha: existing.sha } : {}),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("GitHub kayıt hatası:", response.status, detail);
    return {
      ok: false,
      message: `GitHub'a yazılamadı (${response.status}). Token'ın bu depoda "Contents: Read and write" iznine sahip olduğundan emin olun.`,
    };
  }

  return {
    ok: true,
    message:
      "Kaydedildi ve depoya işlendi. Site yeniden yayınlanınca (genelde 1–2 dakika) değişiklik canlıya çıkar.",
  };
}

export async function saveSection(
  section: SectionId,
  data: unknown,
): Promise<SaveResult> {
  try {
    return storageMode === "github"
      ? await saveToGitHub(section, data)
      : await saveLocally(section, data);
  } catch (error) {
    console.error("İçerik kaydedilemedi:", error);
    return {
      ok: false,
      message:
        "Kaydedilemedi. Sunucu günlüklerinde ayrıntı var. Vercel gibi ortamlarda " +
        "GITHUB_TOKEN ve GITHUB_REPO tanımlanmadan kayıt yapılamaz.",
    };
  }
}
