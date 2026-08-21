/**
 * Siteyi sunucu gerektirmeyen saf HTML/CSS/JS olarak `out/` klasörüne üretir.
 *
 *   npm run build:static
 *
 * Ortam değişkenini komut satırında ayarlamak yerine bu betiği kullanıyoruz;
 * `STATIC_EXPORT=1 next build` yazımı Windows'un komut isteminde çalışmaz.
 */
import { spawnSync } from "node:child_process";
import { existsSync, renameSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");

/**
 * Yönetim paneli sunucu ister (oturum çerezi + Server Action), statik dışa
 * aktarımda yeri yoktur. Build boyunca klasörü `_` önekiyle gizliyoruz —
 * Next.js `_` ile başlayan klasörleri adres olarak yayımlamaz — ve build
 * bitince eski adına döndürüyoruz.
 */
const adminDir = path.join(root, "src", "app", "yonetim");
const hiddenDir = path.join(root, "src", "app", "_yonetim");

const hide = () => existsSync(adminDir) && renameSync(adminDir, hiddenDir);
const restore = () => existsSync(hiddenDir) && renameSync(hiddenDir, adminDir);

// Build yarıda kesilse bile klasör geride kalmasın.
process.on("exit", restore);
process.on("SIGINT", () => process.exit(130));
process.on("SIGTERM", () => process.exit(143));

let result;
try {
  hide();
  result = spawnSync(process.execPath, [nextBin, "build"], {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, STATIC_EXPORT: "1" },
  });
} finally {
  restore();
}

if (result.status !== 0) process.exit(result.status ?? 1);

console.log(
  "\n✓ Statik site hazır: out/\n" +
    "  Yerelde bakmak için:  npm run preview:static\n" +
    "  Hostinge yüklemek için: out/ klasörünün İÇİNDEKİLERİ public_html'e kopyalayın.\n",
);
