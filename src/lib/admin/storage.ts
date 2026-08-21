import "server-only";

import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import type { SectionId } from "./sections";

/**
 * Panelden yapılan değişikliklerin nereye yazılacağı.
 *
 * - **github**: `GITHUB_TOKEN` + `GITHUB_REPO` tanımlıysa dosya doğrudan depoya
 *   işlenir. Vercel gibi dosya sisteminin salt okunur olduğu ortamlarda tek yol
 *   budur; push, sitenin yeniden yayınlanmasını tetikler.
 * - **local**: Aksi hâlde proje klasöründeki dosyaya doğrudan yazılır
 *   (kendi bilgisayarınız ya da kendi sunucunuz).
 *
 * Hem metin (içerik JSON'ları) hem ikili (galeri görselleri) dosyalar aynı
 * yoldan geçer.
 */

export type StorageMode = "github" | "local";

export const storageMode: StorageMode =
  process.env.GITHUB_TOKEN && process.env.GITHUB_REPO ? "github" : "local";

export type SaveResult = { ok: boolean; message: string };

const ROOT = process.cwd();

function serialize(data: unknown) {
  return `${JSON.stringify(data, null, 2)}\n`;
}

/* ---------------- GitHub ---------------- */

type GitHubFile = { sha?: string };

function githubRequest(url: string, init?: RequestInit) {
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

function githubBase(repoPath: string) {
  return `https://api.github.com/repos/${process.env.GITHUB_REPO}/contents/${repoPath}`;
}

function branch() {
  return process.env.GITHUB_BRANCH ?? "main";
}

/** Dosyanın mevcut sha'sı; güncelleme ve silme için gerekir. */
async function currentSha(repoPath: string) {
  const response = await githubRequest(
    `${githubBase(repoPath)}?ref=${encodeURIComponent(branch())}`,
  );
  if (response.status === 404) return { ok: true, sha: undefined as string | undefined };
  if (!response.ok) return { ok: false, sha: undefined };
  const file: GitHubFile = await response.json();
  return { ok: true, sha: file.sha };
}

async function putToGitHub(
  repoPath: string,
  base64: string,
  message: string,
): Promise<SaveResult> {
  const existing = await currentSha(repoPath);
  if (!existing.ok) {
    return {
      ok: false,
      message:
        "GitHub dosyayı okuyamadı. Token izinlerini ve GITHUB_REPO değerini kontrol edin.",
    };
  }

  const response = await githubRequest(githubBase(repoPath), {
    method: "PUT",
    body: JSON.stringify({
      message,
      content: base64,
      branch: branch(),
      ...(existing.sha ? { sha: existing.sha } : {}),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("GitHub kayıt hatası:", response.status, detail);

    // GitHub'ın kendi açıklaması teşhisi kolaylaştırır ("Resource not
    // accessible by personal access token" gibi), mesaja ekliyoruz.
    let reason = "";
    try {
      const parsed = JSON.parse(detail) as { message?: string };
      if (parsed.message) reason = ` GitHub: “${parsed.message}”`;
    } catch {
      /* gövde JSON değilse boş geç */
    }

    const hint =
      response.status === 403 || response.status === 404
        ? ' Token ayarlarında "Repository access" bu depoyu içermeli ve "Repository permissions → Contents" değeri "Read and write" olmalı. Ayarı değiştirdikten sonra Vercel\'de yeniden yayınlayın.'
        : "";

    return {
      ok: false,
      message: `GitHub'a yazılamadı (${response.status}).${reason}${hint}`,
    };
  }

  return {
    ok: true,
    message:
      "Kaydedildi ve depoya işlendi. Site yeniden yayınlanınca (genelde 1–2 dakika) değişiklik canlıya çıkar.",
  };
}

/* ---------------- Ortak API ---------------- */

/** Proje köküne göre bir dosyayı yazar. `repoPath` örn. "content/faqs.json". */
async function writeAnyFile(
  repoPath: string,
  bytes: Buffer,
  message: string,
): Promise<SaveResult> {
  if (storageMode === "github") {
    return putToGitHub(repoPath, bytes.toString("base64"), message);
  }

  const target = path.join(ROOT, repoPath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, bytes);
  return {
    ok: true,
    message:
      "Kaydedildi. Geliştirme sunucusunda değişiklik hemen görünür; " +
      "yayındaki site için yeniden yayınlamanız gerekir.",
  };
}

export async function saveSection(
  section: SectionId,
  data: unknown,
): Promise<SaveResult> {
  try {
    return await writeAnyFile(
      `content/${section}.json`,
      Buffer.from(serialize(data), "utf8"),
      `İçerik güncellendi: ${section} (yönetim paneli)`,
    );
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

/** Galeri görselini `public/galeri/` altına yazar. */
export async function saveImage(
  filename: string,
  bytes: Buffer,
): Promise<SaveResult> {
  try {
    return await writeAnyFile(
      `public/galeri/${filename}`,
      bytes,
      `Görsel yüklendi: ${filename} (yönetim paneli)`,
    );
  } catch (error) {
    console.error("Görsel kaydedilemedi:", error);
    return { ok: false, message: "Görsel kaydedilemedi." };
  }
}

/** Artık kullanılmayan bir görseli siler. Başarısız olursa sessizce geçer. */
export async function deleteImage(src: string): Promise<void> {
  const filename = path.basename(src);
  const repoPath = `public/galeri/${filename}`;

  try {
    if (storageMode === "github") {
      const existing = await currentSha(repoPath);
      if (!existing.ok || !existing.sha) return;
      await githubRequest(githubBase(repoPath), {
        method: "DELETE",
        body: JSON.stringify({
          message: `Görsel silindi: ${filename} (yönetim paneli)`,
          sha: existing.sha,
          branch: branch(),
        }),
      });
      return;
    }
    await unlink(path.join(ROOT, repoPath));
  } catch (error) {
    // Dosya zaten yoksa ya da silinemezse içerik kaydını engellemeyiz.
    console.warn("Görsel silinemedi:", filename, error);
  }
}
