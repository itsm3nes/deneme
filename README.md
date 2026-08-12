# Meva Ağız ve Diş Sağlığı Polikliniği — web sitesi taslağı

Yalova Bayraktepe'de hizmet veren **Meva Ağız ve Diş Sağlığı Polikliniği** için
hazırlanmış tanıtım sitesi taslağı. Klasik bir diş kliniği sitesinde bulunması
beklenen tüm bölümler kurulu: tedavi sayfaları, hekim kadrosu, galeri,
öncesi/sonrası karşılaştırma, blog, S.S.S., randevu formu, iletişim ve harita,
KVKK metni, SEO dosyaları.

Renk yönü: **açık mavi + beyaz**, logodaki lacivert (`#2f4179`) ana marka rengi
olarak kullanıldı.

> ⚠️ **Bu bir taslaktır.** Sitedeki bilgilerin bir kısmı internetteki açık
> kaynaklardan derlendi, bir kısmı ise yer tutucudur. Yayına almadan önce
> aşağıdaki **"Doğrulanması gerekenler"** listesini tamamlayın.

## Kurulum

Node.js 22.13+ gerekir.

```bash
npm install
npm run dev          # http://localhost:3000
```

Üretim için:

```bash
npm run build && npm start
```

## Sayfalar

| Yol | İçerik |
| --- | --- |
| `/` | Hero, tedavi kartları, neden biz, süreç, hekimler, galeri, yorumlar, S.S.S. + hızlı randevu formu, blog |
| `/hakkimizda` | Klinik tanıtımı, değerler, sterilizasyon zinciri, anlaşmalı kurumlar |
| `/tedaviler` | 16 tedavi başlığının listesi |
| `/tedaviler/[slug]` | Tedavi detayı: süreç adımları, kimler için uygun, özet bilgiler, tedaviye özel S.S.S. (+ FAQ yapılandırılmış verisi) |
| `/hekimlerimiz` | Hekim kartları (şu an yer tutucu) |
| `/galeri` | Klinik fotoğrafları + öncesi/sonrası sürgülü karşılaştırma |
| `/blog`, `/blog/[slug]` | 5 bilgilendirme yazısı |
| `/sss` | Gruplanmış sık sorulan sorular |
| `/randevu` | Randevu formu + hazırlık bilgileri |
| `/iletisim` | İletişim kartları, haftalık çalışma saatleri, form, Google Maps |
| `/anlasmali-kurumlar` | Kurum protokolleri |
| `/kvkk` | KVKK aydınlatma metni ve çerez politikası (örnek metin) |

Ayrıca: `sitemap.xml`, `robots.txt`, `Dentist` şeması (JSON-LD), 404 sayfası,
mobil menü, WhatsApp butonu.

## İçerik nerede düzenlenir?

Sitedeki metinlerin tamamı üç dosyada toplandı — sayfalara dokunmadan
güncelleyebilirsiniz:

| Dosya | İçerik |
| --- | --- |
| `src/lib/clinic.ts` | Adres, telefon, WhatsApp, e-posta, çalışma saatleri, sosyal medya, menü |
| `src/lib/treatments.ts` | 16 tedavi: açıklama, adımlar, özet bilgiler, S.S.S. |
| `src/lib/content.ts` | Hekimler, S.S.S., hasta yorumları, blog yazıları, anlaşmalı kurumlar |

## Doğrulanması gerekenler

Aşağıdaki bilgiler açık kaynaklarda bulunamadı ya da teyit edilemedi. **Hiçbiri
uydurulmadı**; yer tutucu olarak bırakıldı ve kodda `⚠️ TASLAK` / `verified: false`
şeklinde işaretlendi.

- [ ] **Hekim kadrosu** — ad, unvan, uzmanlık, özgeçmiş, fotoğraf (`src/lib/content.ts` → `doctors`). Şu an 4 yer tutucu kart var.
- [ ] **Çalışma saatleri** — şu an hafta içi 09:00–19:00 / Cumartesi 09:00–17:00 varsayıldı (`src/lib/clinic.ts` → `hours`).
- [ ] **WhatsApp numarası** — sabit hat numarası kullanıldı, gerçek WhatsApp hattı girilmeli (`clinic.whatsapp`).
- [ ] **Harita konumu** — `clinic.address.geo` içindeki koordinatlar yaklaşıktır; Google Maps kaydından alınmalı.
- [ ] **Hasta yorumları** — ana sayfadaki yorumlar örnek metindir. Gerçek yorumlarla değiştirin ya da bölümü kaldırın (hastadan yazılı izin gerekir).
- [ ] **Anlaşmalı kurumlar** — yalnızca basına yansıyan YTSO protokolü listelendi; güncel liste alınmalı.
- [ ] **Kuruluş yılı, ünit sayısı, klinik büyüklüğü** — hakkımızda metnine eklenmedi.
- [ ] **KVKK metni** — örnek taslaktır, hukukçu incelemesinden geçmelidir.

### Doğrulanmış bilgiler (kaynak: mevadis.com.tr ve harita kayıtları)

- Adres: Bayraktepe Mah. Şehit Ömer Faydalı Cad. No: 77/A, Merkez / Yalova
- Telefon: 0226 813 33 77
- E-posta: mevadisklinikleri@gmail.com
- Instagram: [@meva.dis](https://www.instagram.com/meva.dis/)
- Tedavi başlıkları: implant, ortodonti, cerrahi, estetik dolgu, endodonti, protez, gülüş tasarımı, porselen dolgu, pedodonti, oral diagnoz, beyazlatma, laminate veneer, periodontoloji, restoratif tedavi, zirkonyum

## Görseller

Sitede henüz fotoğraf yok; her fotoğrafın yeri kesikli çerçeveli **yer tutucu**
ile ve önerilen ölçüsüyle gösteriliyor (`PhotoSlot` bileşeni).

Fotoğraflar hazır olduğunda:

1. Dosyaları `public/galeri/` altına koyun.
2. İlgili `<PhotoSlot … />` satırını `next/image` ile değiştirin:

```tsx
<Image src="/galeri/bekleme-alani.jpg" alt="Bekleme alanı" width={1200} height={900} className="rounded-xl2" />
```

Öncesi/sonrası bileşeni (`BeforeAfter`) `before` ve `after` proplarına doğrudan
`<Image fill />` alabilir; başka değişiklik gerekmez.

### Logo

`src/components/site/Logo.tsx` içindeki işaret, kliniğin logosuna (diş + diş
fırçası + gülümseme yayı) benzetilerek **yeniden çizilmiş** bir vektördür ve
`currentColor` kullandığı için her zeminde renk alır. Orijinal logo dosyanız
hazır olduğunda `public/logo.svg` üzerine yazıp bileşendeki `<svg>` bloğunu
`next/image` ile değiştirmeniz yeterli. Favicon: `src/app/icon.svg`.

## Randevu formu

Form bir Server Action ile çalışır (`src/app/randevu/actions.ts`): alanlar
sunucuda doğrulanır, bot tuzağı vardır ve talep
`DATA_DIR/randevu-talepleri.jsonl` dosyasına yazılır (varsayılan `./storage`).

**Yayına almadan önce** bu kaydı gerçek bir kanala bağlayın — e-posta (Resend,
SMTP), SMS ya da klinik yazılımınızın API'si. İlgili yer dosyada
`⚠️ TASLAK` yorumuyla işaretli.

## Mevzuat notu

Sağlık hizmeti tanıtımında fiyat listesi, indirim oranı, tedavi garantisi ve
"en iyi / tek" türü karşılaştırmalı ifadeler yayımlanamaz; öncesi–sonrası
görselleri için hastadan yazılı aydınlatılmış onam gerekir. Site metinleri bu
çerçeveye uygun yazıldı — güncellerken aynı çizgiyi koruyun.

## Teknik

- **Next.js 16** (App Router, Turbopack) + React 19 + TypeScript
- **Tailwind CSS v4** — tasarım değişkenleri `src/app/globals.css` içindeki `@theme` bloğunda
- Fontlar `next/font` ile kendi sunucumuzdan servis edilir (Inter + Plus Jakarta Sans)
- İkonlar el yazımı inline SVG (`src/components/site/Icons.tsx`) — harici ikon paketi yok
- Görüş alanına girince beliren bölümler saf CSS (`animation-timeline: view()`); destek yoksa içerik olduğu gibi görünür
- 37 sayfanın tamamı build sırasında statik üretilir
