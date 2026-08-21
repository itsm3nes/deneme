# Meva Ağız ve Diş Sağlığı Polikliniği — web sitesi

Yalova Bayraktepe'de hizmet veren **Meva Ağız ve Diş Sağlığı Polikliniği** için
hazırlanmış tanıtım sitesi: 16 tedavi sayfası, hekim kadrosu, galeri,
öncesi/sonrası karşılaştırma, blog, S.S.S., randevu formu, iletişim ve harita,
KVKK metni, SEO dosyaları ve içerik yönetim paneli.

Renk yönü: **açık mavi + beyaz**, logodaki lacivert (`#2f4179`) ana marka rengi.

> ⚠️ **Site henüz taslak.** Hekim kartları ve hasta yorumları yer tutucudur.
> Yayına almadan önce aşağıdaki **[Yayın kontrol listesi](#yayın-kontrol-listesi)**
> tamamlanmalıdır.

## Kurulum

Node.js 22.13+ gerekir.

```bash
npm install
npm run dev              # http://localhost:3000
```

| Komut | İşi |
| --- | --- |
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` / `npm start` | Üretim derlemesi ve sunucusu |
| `npm run build:static` | Sunucusuz saf HTML çıktısı → `out/` |
| `npm run preview:static` | `out/` klasörünü yerelde yayınlar |
| `npm run lint` | ESLint |

## Sayfalar

| Yol | İçerik |
| --- | --- |
| `/` | Hero, tedavi kartları, neden biz, süreç, hekimler, galeri, yorumlar, S.S.S. + hızlı randevu formu, blog |
| `/hakkimizda` | Klinik tanıtımı, değerler, sterilizasyon zinciri, anlaşmalı kurumlar |
| `/tedaviler` | 16 tedavi başlığının listesi |
| `/tedaviler/[slug]` | Tedavi detayı: süreç adımları, kimler için uygun, özet bilgiler, tedaviye özel S.S.S. (+ FAQ yapılandırılmış verisi) |
| `/hekimlerimiz` | Hekim kartları |
| `/galeri` | Klinik fotoğrafları + öncesi/sonrası sürgülü karşılaştırma |
| `/blog`, `/blog/[slug]` | Bilgilendirme yazıları |
| `/sss` | Gruplanmış sık sorulan sorular |
| `/randevu` | Randevu formu + hazırlık bilgileri |
| `/iletisim` | İletişim kartları, haftalık çalışma saatleri, form, Google Maps |
| `/anlasmali-kurumlar` | Kurum protokolleri |
| `/kvkk` | KVKK aydınlatma metni ve çerez politikası |
| `/yonetim` | İçerik yönetim paneli (parola korumalı, aramaya kapalı) |

Ayrıca: `sitemap.xml`, `robots.txt`, `Dentist` şeması (JSON-LD), 404 sayfası,
mobil menü, WhatsApp butonu.

## İçerik yönetimi

Sitedeki metinlerin tamamı `content/` klasöründeki JSON dosyalarındadır ve
**yönetim panelinden** düzenlenir — koda dokunmanız gerekmez.

| Dosya | İçerik |
| --- | --- |
| `content/clinic.json` | Adres, telefon, WhatsApp, e-posta, çalışma saatleri, sosyal medya |
| `content/treatments.json` | 16 tedavi: açıklama, adımlar, özet bilgiler, S.S.S. |
| `content/doctors.json` | Hekim kartları |
| `content/faqs.json` | Sık sorulan sorular |
| `content/testimonials.json` | Hasta yorumları |
| `content/posts.json` | Blog yazıları |
| `content/partners.json` | Anlaşmalı kurumlar |
| `content/gallery.json` | Galeri fotoğrafları ve öncesi/sonrası vakaları |

### Paneli açma

Panel, parola tanımlanmadan **kapalıdır**:

```
ADMIN_PASSWORD=uzun-ve-tahmin-edilemez-bir-parola
```

Kendi bilgisayarınızda proje kökünde `.env.local` dosyasına yazıp `npm run dev`
ile <http://localhost:3000/yonetim> adresine gidin. Vercel'de: Project Settings
→ Environment Variables.

### Değişiklikler nereye yazılır?

| Ortam | Davranış |
| --- | --- |
| Kendi bilgisayarınız / kendi Node sunucunuz | `content/*.json` dosyalarına doğrudan yazılır |
| Vercel (dosya sistemi salt okunur) | GitHub deposuna işlenir → site kendiliğinden yeniden yayınlanır |

Vercel için üç değişken daha gerekir (bkz. `.env.example`): `GITHUB_TOKEN`
(fine-grained, yalnızca bu depoda *Contents: Read and write*), `GITHUB_REPO`,
`GITHUB_BRANCH`. Tanımlanmazsa panel açılır ama kayıt sırasında hata verir.

> İçerik build sırasında sayfalara gömülür; bir değişikliğin canlıda görünmesi
> için sitenin yeniden yayınlanması gerekir. GitHub kipinde bu otomatiktir
> (1–2 dakika), yerel kipte `npm run build` ile.

### Fotoğraflar

`/yonetim/galeri` ekranından yüklenir. Görseller **tarayıcıda** küçültülüp
WebP'ye çevrilir (uzun kenar en fazla 1600 px) — telefondan çekilmiş 5 MB'lık
bir kare ~200 KB'a iner. Dosyalar `public/galeri/` altında saklanır.

- Her fotoğrafa **açıklama (alt) metni zorunludur**: görme engelli ziyaretçiler
  ekran okuyucuyla bunu duyar, arama motorları da bunu okur.
- Sıralama sitede de geçerlidir: ilk iki fotoğraf ana sayfa ve hakkımızda
  bölümlerinde, sonrakiler ana sayfadaki galeri şeridinde, tamamı galeri
  sayfasında görünür.
- Yüklenmemiş her alan kesikli çerçeveli yer tutucu olarak kalır; yani galeri
  boşken de site tutarlı görünür.
- Öncesi/sonrası vakaları da buradan eklenir. Hasta görselleri yalnızca yazılı
  aydınlatılmış onamla yayımlanabilir.

### Panelin kapsamadıkları

- **Tasarım ve bölüm sıralaması** — kod tarafındadır.

Panel `robots.txt` ile taramaya kapalıdır, `noindex` işaretlidir ve statik HTML
sürümüne hiç dâhil edilmez.

## Yayınlama (Vercel)

1. [vercel.com](https://vercel.com) → **Continue with GitHub** ile giriş yapın.
2. **Add New… → Project** → `itsm3nes/deneme` deposunu **Import** edin.
   Framework olarak Next.js kendiliğinden algılanır; build ayarlarına dokunmayın.
3. **Deploy**.
4. **Önemli:** Deponun varsayılan dalı hâlâ eski bir proje. Vercel üretim dalını
   oradan aldığı için **Project Settings → Git → Production Branch** değerini
   `claude/yalova-meva-dental-website-uapcgn` yapıp **Redeploy** edin.

Bundan sonra bu dala her push'ta site kendiliğinden yeniden yayınlanır.

### Domain — mevadisyalova.com

Domain **Vercel üzerinden** alındı. Bu yolda DNS ayarı gerekmez: nameserver'lar,
A/CNAME kayıtları ve HTTPS sertifikası kendiliğinden yapılandırılır.

Birincil adres **`https://mevadisyalova.com`** (www'suz);
`www.mevadisyalova.com` buraya yönlendirilir.

Kontrol edilecekler — Vercel → **Project Settings → Domains**:

1. `mevadisyalova.com` **doğru projeye** bağlı ve "Valid Configuration" görünüyor.
2. `www.mevadisyalova.com` ekli ve **Redirect to mevadisyalova.com** seçili.
3. Sertifika hazır (kilit simgesi). Yeni domainlerde birkaç dakika sürebilir.

Domaini başka bir kayıtçıdan almış olsaydınız Vercel'in gösterdiği `A` ve
`CNAME` kayıtlarını o kayıtçının DNS panelinde tanımlamanız gerekirdi; Vercel'den
alındığında bu adım atlanır.

### Yayına geçerken zorunlu ayar

Site, `NEXT_PUBLIC_SITE_URL` tanımlanana kadar **taslak** kabul edilir:
`robots.txt` tüm taramayı kapatır ve sayfalar `noindex` işaretlenir — yer tutucu
içerik arama sonuçlarına düşmesin diye.

Domain bağlandıktan sonra Vercel'de tanımlayın ve yeniden yayınlayın:

```
NEXT_PUBLIC_SITE_URL = https://mevadisyalova.com
```

Değer, sitenin gerçekten servis edildiği adresle **birebir** aynı olmalı
(www'lu/www'suz farkı dâhil); aksi hâlde canonical adresler yanlış çıkar.

Bu değişken canonical, Open Graph ve sitemap adreslerini de düzeltir.

## Yayın kontrol listesi

Aşağıdakiler tamamlanmadan site hastalara açılmamalı. İlk üçü **panelden**
(`/yonetim`) yapılır.

- [ ] **Hekim kadrosu** — 4 kart hâlâ "Dt. Ad Soyad". Gerçek ad, unvan, uzmanlık
      ve özgeçmişleri girin; girdikten sonra "Yer tutucu kart" kutusunun işaretini kaldırın.
- [ ] **Hasta yorumları** — örnek metinler. Gerçek yorumlarla değiştirin (hastadan
      yazılı izin gerekir) ya da kayıtları silin.
- [ ] **WhatsApp numarası** — şu an sabit hat. Gerçek WhatsApp hattını girin
      (form talepleri buraya gidiyor, bu madde kritik).
- [ ] **Harita konumu** — `content/clinic.json` içindeki enlem/boylam yaklaşıktır.
- [ ] **Klinik fotoğrafları** — panelden yükleyin (`/yonetim/galeri`); yüklenene
      kadar kesikli çerçeveli yer tutucular görünür.
- [ ] **Logo** — çizilen vektörün yerine orijinal dosya (`public/logo.svg`).
- [ ] **KVKK metni** — örnek taslaktır, hukukçu incelemesinden geçmelidir.
      VERBİS kayıt yükümlülüğünüz olup olmadığını da kontrol ettirin.
- [ ] **Anlaşmalı kurumlar** — yalnızca basına yansıyan YTSO protokolü var.
- [ ] **`NEXT_PUBLIC_SITE_URL`** — tanımlanmadan site aramaya kapalı kalır.
- [ ] **Eski site** — klinik `mevadis.com.tr` adresini kullanıyor. İki site aynı
      anda yayında kalırsa arama motorları içeriği bölüşür; eskisini
      `mevadisyalova.com` adresine 301 ile yönlendirmek en temizi.
- [ ] **Google Business Profile** — kliniğin harita kaydındaki web sitesi
      alanını yeni adresle güncelleyin; yerel aramada en çok işe yarayan adım bu.
- [ ] **Search Console** — domaini [search.google.com/search-console](https://search.google.com/search-console)
      üzerinde doğrulayıp `sitemap.xml` adresini gönderin (yayına aldıktan sonra).

### Doğrulanmış bilgiler

Kaynak: mevadis.com.tr ve harita kayıtları.

- Adres: Bayraktepe Mah. Şehit Ömer Faydalı Cad. No: 77/A, Merkez / Yalova
- Telefon: 0226 813 33 77
- E-posta: mevadisklinikleri@gmail.com
- Instagram: [@meva.dis](https://www.instagram.com/meva.dis/)
- Tedavi başlıkları: implant, ortodonti, cerrahi, estetik dolgu, endodonti,
  protez, gülüş tasarımı, porselen dolgu, pedodonti, oral diagnoz, beyazlatma,
  laminate veneer, periodontoloji, restoratif tedavi, zirkonyum

## Randevu formu

Form sunucu kullanmaz. Alanlar tarayıcıda doğrulanır (bot tuzağı dâhil),
ardından bilgiler hazır bir mesaja çevrilip **WhatsApp'ta açılır**:

```
Merhaba, randevu talebi oluşturmak istiyorum.

Ad Soyad: Ayşe Yılmaz
Telefon: 05551112233
Tedavi: İmplant Tedavisi
Tercih edilen gün: 2026-09-02
Not: Sol alt azıda ağrı var.
```

Gönderim, tıklama olayının içinde eşzamanlı yapılır; tarayıcının açılır pencere
engelleyicisi araya girmez. Yine de engellenirse başarı ekranındaki düğmeyle
elle açılabilir. Böylece hiçbir talep sunucuda kaybolmaz ve e-posta/SMS servisi
kurmak gerekmez.

Mantık `src/lib/appointment.ts` (doğrulama + mesaj biçimi) ve
`src/components/site/AppointmentForm.tsx` içindedir. İleride e-postaya da
göndermek isterseniz doğrulama sonrası bir route handler'a POST edip
Resend/SMTP'ye iletmek yeterli — doğrulama kodu paylaşımlı olduğu için tekrar
yazılmaz.

## Statik HTML (paylaşımlı hosting / yerel)

```bash
npm run build:static     # çıktı: out/
npm run preview:static   # http://localhost:3000
```

`out/` klasörünün **içindekileri** herhangi bir yere koyabilirsiniz —
paylaşımlı hostingte `public_html`, GitHub Pages, Netlify. Node.js gerekmez.

- `index.html` dosyasına çift tıklayıp `file://` ile açmak **çalışmaz** —
  sayfalar `/_next/...` gibi mutlak yollar kullanır. `npm run preview:static`
  küçük bir yerel sunucu başlatır.
- Randevu formu statik sürümde de tam çalışır.
- Yönetim paneli statik sürüme dâhil edilmez (sunucu ister).
- Alt sayfa adresleri klasör biçimindedir: `/tedaviler/implant/`.

## Görseller

Fotoğrafların yeri kesikli çerçeveli **yer tutucu** ile ve önerilen ölçüsüyle
gösteriliyor (`PhotoSlot` bileşeni). Fotoğraflar hazır olduğunda dosyaları
`public/galeri/` altına koyup ilgili `<PhotoSlot … />` satırını değiştirin:

```tsx
<Image src="/galeri/bekleme-alani.jpg" alt="Bekleme alanı" width={1200} height={900} className="rounded-xl2" />
```

Öncesi/sonrası bileşeni (`BeforeAfter`) `before` ve `after` proplarına doğrudan
`<Image fill />` alabilir.

### Logo

`src/components/site/Logo.tsx` içindeki işaret, kliniğin logosuna (diş + diş
fırçası + gülümseme yayı) benzetilerek **yeniden çizilmiş** bir vektördür ve
`currentColor` kullandığı için her zeminde renk alır. Orijinal logo dosyanız
hazır olduğunda `public/logo.svg` üzerine yazıp bileşendeki `<svg>` bloğunu
`next/image` ile değiştirin. Favicon: `src/app/icon.svg`.

## Mevzuat notu

Sağlık hizmeti tanıtımında fiyat listesi, indirim oranı, tedavi garantisi ve
"en iyi / tek" türü karşılaştırmalı ifadeler yayımlanamaz; öncesi–sonrası
görselleri için hastadan yazılı aydınlatılmış onam gerekir. Site metinleri bu
çerçeveye uygun yazıldı — güncellerken aynı çizgiyi koruyun.

## Teknik

- **Next.js 16** (App Router, Turbopack) + React 19 + TypeScript — hem sunuculu
  hem statik export ile çalışır (`next.config.ts`)
- **Tailwind CSS v4** — tasarım değişkenleri `src/app/globals.css` içindeki `@theme` bloğunda
- Fontlar `next/font` ile kendi sunucumuzdan servis edilir (Inter + Plus Jakarta Sans)
- İkonlar el yazımı inline SVG (`src/components/site/Icons.tsx`) — harici ikon paketi yok
- Görüş alanına girince beliren bölümler saf CSS (`animation-timeline: view()`);
  destek yoksa içerik olduğu gibi görünür
- Herkese açık sayfalar `src/app/(site)/` rota grubunda; yönetim paneli
  `src/app/yonetim/` altında kendi sade iskeletiyle
- 37 sayfanın tamamı build sırasında statik üretilir
