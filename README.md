# Kadraj

Fotoğrafçılar için müşteri seçim galerisi. Fotoğrafçı çekimi yükler, tek bağlantıyla müşteriye
gönderir; müşteri telefonundan beğendiği kareleri işaretler ve her karenin altına not bırakır.
Seçim tamamlandığında fotoğrafçı seçilenleri notlarıyla görür ve Lightroom Classic'e aktarır.

Arayüz Türkçe ve İngilizce; her sayfa hem telefon hem bilgisayar için tasarlandı.

> Client proofing galleries for photographers. Share a shoot with one link, let the client pick
> favourites and leave a note on any frame from their phone, then push the picks into Lightroom
> Classic. Turkish and English, mobile and desktop.

## Kurulum

**Node.js 22.13 veya üzeri** gerekir — veritabanı Node'un yerleşik `node:sqlite` modülünü
kullanır, bu yüzden C++ derleyicisi ya da Visual Studio Build Tools kurmanıza gerek yoktur.

```bash
npm install
cp .env.example .env.local          # AUTH_SECRET değerini doldurun
npm run dev                          # http://localhost:3000
```

`AUTH_SECRET` üretmek için:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Üretim için:

```bash
npm run build && npm start
```

## Akış

1. **Kayıt / giriş** — fotoğrafçı hesabı açar.
2. **Galeri oluştur** — çekim adı, müşteri bilgisi, erişim kodu, en az/en fazla seçim sayısı.
3. **Fotoğrafları yükle** — sürükle bırak; her kare için önizleme ve küçük resim üretilir.
4. **Paylaş** — galeriye özel bağlantı ve 6 haneli erişim kodu. Hazır mesaj tek tıkla kopyalanır.
5. **Müşteri seçer** — bağlantıyı açar, kodu girer, kareleri işaretler, not bırakır, gönderir.
6. **Seçim kilitlenir** — gönderim sonrası müşteri değişiklik yapamaz. Fotoğrafçı isterse yeniden açar.
7. **Lightroom'a aktar** — aşağıdaki yöntemlerden biriyle.

## Lightroom Classic aktarımı

Fotoğrafçı, seçimler sayfasından yıldız değerini, renk etiketini ve anahtar kelimeyi seçip indirir.

**XMP sidecar paketi (ZIP)** — Her seçili kare için bir `.xmp` dosyası; yıldız (`xmp:Rating`),
renk etiketi (`xmp:Label`), anahtar kelime (`dc:subject` + `lr:hierarchicalSubject`) ve müşteri
notunu (`dc:description`) taşır. Dosyalar RAW dosyalarınızın **yanına** kopyalanır, sonra
Lightroom Classic'te fotoğraflar seçilip `Metadata ▸ Read Metadata from Files` çalıştırılır.

Sidecar adları yüklediğiniz dosyanın uzantısız adıyla eşleşir — bu yüzden RAW dosyalarınızın
JPEG önizlemelerini **aynı dosya adıyla** yükleyin (`IMG_4821.jpg` → `IMG_4821.xmp` → `IMG_4821.CR2`).

**Dosya adı listesi (TXT)** — Seçili dosya adları boşlukla ayrılmış tek satır.
`Library ▸ Filter Bar ▸ Text` bölümünde alanı `Filename`, kuralı `Contains Any` yapıp yapıştırın.

**CSV** — Dosya adı, müşteri notu ve seçim zamanı. UTF-8 BOM ile, Excel'de Türkçe karakterler bozulmaz.

Ayrıca seçilen karelerin web boyutlu JPEG'leri tek ZIP olarak indirilebilir.

## Teknik

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind CSS v4**
- **SQLite** (Node yerleşik `node:sqlite`) — şema ilk sorguda kurulur, harici bağımlılık yok
- **sharp** — yüklenen her kare 2560px JPEG önizleme ve 720px WebP küçük resme dönüştürülür
- Oturumlar `jose` ile imzalanmış HTTP-only çerezlerde; parolalar `bcryptjs` ile saklanır
- Müşteri erişimi galeri başına HMAC imzalı çerezle verilir — müşterinin hesap açmasına gerek yok

Dil yönlendirmesi `src/proxy.ts` içinde: yolda dil öneki yoksa `NEXT_LOCALE` çerezine, yoksa
`Accept-Language` başlığına bakılır, o da yoksa Türkçe'ye düşer.

Veritabanı ve fotoğraflar `DATA_DIR` (varsayılan `./storage`) altında tutulur; bu dizin
sürüm kontrolüne girmez.
