/**
 * Siteyi sunucu gerektirmeyen saf HTML/CSS/JS olarak `out/` klasörüne üretir.
 *
 *   npm run build:static
 *
 * Ortam değişkenini komut satırında ayarlamak yerine bu betiği kullanıyoruz;
 * `STATIC_EXPORT=1 next build` yazımı Windows'un komut isteminde çalışmaz.
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");

const result = spawnSync(process.execPath, [nextBin, "build"], {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env, STATIC_EXPORT: "1" },
});

if (result.status !== 0) process.exit(result.status ?? 1);

console.log(
  "\n✓ Statik site hazır: out/\n" +
    "  Yerelde bakmak için:  npm run preview:static\n" +
    "  Hostinge yüklemek için: out/ klasörünün İÇİNDEKİLERİ public_html'e kopyalayın.\n",
);
