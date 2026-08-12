/**
 * Site metinleri: hekim kadrosu, sık sorulan sorular, hasta yorumları, blog.
 *
 * ⚠️ TASLAK NOTU: Hekim isimleri ve hasta yorumları AÇIK KAYNAKLARDA
 * BULUNAMADI, bu yüzden uydurulmadı — yer tutucu olarak bırakıldı.
 * `placeholder: true` işaretli her kaydı yayına almadan önce gerçek bilgiyle
 * değiştirin ya da ilgili bölümü siteden kaldırın.
 */

export type Doctor = {
  slug: string;
  name: string;
  title: string;
  field: string;
  bio: string;
  interests: string[];
  placeholder?: boolean;
};

export const doctors: Doctor[] = [
  {
    slug: "hekim-1",
    name: "Dt. Ad Soyad",
    title: "Diş Hekimi",
    field: "Ağız, Diş ve Çene Cerrahisi",
    bio: "İmplant cerrahisi, gömülü diş çekimi ve kemik greftleme uygulamaları üzerine çalışıyor. Hastalarına tedavi öncesi süreci ayrıntılı anlatmayı önemsiyor.",
    interests: ["İmplantoloji", "Gömülü diş cerrahisi", "Kemik greftleme"],
    placeholder: true,
  },
  {
    slug: "hekim-2",
    name: "Dt. Ad Soyad",
    title: "Diş Hekimi",
    field: "Ortodonti",
    bio: "Çocuk ve yetişkin ortodontisi, şeffaf plak tedavileri ve erken dönem çene gelişimi takibiyle ilgileniyor.",
    interests: ["Şeffaf plak", "Sabit ortodonti", "Erken dönem tedavi"],
    placeholder: true,
  },
  {
    slug: "hekim-3",
    name: "Dt. Ad Soyad",
    title: "Diş Hekimi",
    field: "Restoratif Diş Tedavisi & Endodonti",
    bio: "Kanal tedavisi, estetik kompozit uygulamaları ve gülüş tasarımı vakalarını yürütüyor.",
    interests: ["Kanal tedavisi", "Estetik dolgu", "Gülüş tasarımı"],
    placeholder: true,
  },
  {
    slug: "hekim-4",
    name: "Dt. Ad Soyad",
    title: "Diş Hekimi",
    field: "Pedodonti",
    bio: "Çocuk hastalarda koruyucu diş hekimliği, davranış yönlendirme ve süt dişi tedavileri üzerine yoğunlaşıyor.",
    interests: ["Koruyucu tedavi", "Fissür örtücü", "Çocuk hastaya yaklaşım"],
    placeholder: true,
  },
];

export type Faq = { q: string; a: string; group: string };

export const faqs: Faq[] = [
  {
    group: "Randevu ve Ziyaret",
    q: "Randevu nasıl alabilirim?",
    a: "Telefonla, WhatsApp üzerinden ya da sitedeki randevu formunu doldurarak talep oluşturabilirsiniz. Form talepleri çalışma saatleri içinde geri aranarak kesinleştirilir.",
  },
  {
    group: "Randevu ve Ziyaret",
    q: "İlk muayeneye gelirken ne getirmeliyim?",
    a: "Kimliğinizi, varsa daha önce çekilmiş röntgenlerinizi ve düzenli kullandığınız ilaçların listesini getirmeniz süreci hızlandırır.",
  },
  {
    group: "Randevu ve Ziyaret",
    q: "Randevuma yetişemezsem ne yapmalıyım?",
    a: "Mümkünse en az bir gün önceden bizi arayın. Böylece randevunuzu erteleyebilir, boşalan saati bekleyen başka bir hastaya verebiliriz.",
  },
  {
    group: "Tedavi Süreci",
    q: "Diş hekimi korkum var, ne yapabilirim?",
    a: "Dental fobi sık görülür ve konuşularak yönetilebilir. Randevunuzun başında hekiminize bunu söyleyin; işlem adım adım anlatılır, gerektiğinde daha kısa seanslar planlanır.",
  },
  {
    group: "Tedavi Süreci",
    q: "Tedavi kaç seans sürer?",
    a: "Dolgu gibi işlemler tek seansta biterken, implant ve ortodonti aylara yayılır. Muayene sonrası size seans sayısını ve takvimi içeren bir plan sunulur.",
  },
  {
    group: "Tedavi Süreci",
    q: "Hamileyken diş tedavisi olabilir miyim?",
    a: "Olabilirsiniz. En uygun dönem 2. trimestırdır (4–6. aylar). Acil olmayan cerrahi işlemler doğum sonrasına bırakılır. Hamileliğinizi mutlaka hekiminize bildirin.",
  },
  {
    group: "Tedavi Süreci",
    q: "Sterilizasyon nasıl sağlanıyor?",
    a: "Kullanılan aletler ön yıkama ve ultrasonik temizlikten sonra otoklavda steril edilir; tek kullanımlık malzemeler her hasta için yenilenir. Ünit yüzeyleri her randevu arasında dezenfekte edilir.",
  },
  {
    group: "Ödeme ve Kurumlar",
    q: "Fiyat bilgisi alabilir miyim?",
    a: "Ağız ve diş sağlığı hizmetlerinde fiyat, ancak muayene sonrası kişiye özel tedavi planı çıkarıldığında verilebilir. Sağlık Bakanlığı mevzuatı gereği internet üzerinden fiyat listesi paylaşılamaz; muayene sonrası ayrıntılı bilgi verilir.",
  },
  {
    group: "Ödeme ve Kurumlar",
    q: "Anlaşmalı kurum indirimlerinden nasıl yararlanırım?",
    a: "Anlaşmalı kurum çalışanı olduğunuzu randevu sırasında belirtmeniz ve kurum kimliğinizi yanınızda getirmeniz yeterlidir.",
  },
  {
    group: "Bakım",
    q: "Ne sıklıkla kontrole gelmeliyim?",
    a: "Şikâyetiniz olmasa bile 6 ayda bir kontrol öneriyoruz. Erken fark edilen çürük ve diş eti sorunları çok daha kısa ve konforlu tedavilerle çözülür.",
  },
  {
    group: "Bakım",
    q: "Diş fırçalamak yeterli mi?",
    a: "Fırça, diş yüzeylerinin yaklaşık üçte ikisine ulaşır. Diş ipi ya da ara yüz fırçası kullanmadan diş aralarındaki plak temizlenemez; günde bir kez ara yüz temizliği önerilir.",
  },
];

export type Testimonial = {
  name: string;
  city: string;
  text: string;
  treatment: string;
  placeholder?: boolean;
};

/**
 * ⚠️ Bu yorumlar ÖRNEK metinlerdir — gerçek hasta yorumu değildir.
 * Yayına almadan önce hastalardan yazılı izinli gerçek yorumlarla değiştirin
 * veya bu bölümü kaldırın.
 */
export const testimonials: Testimonial[] = [
  {
    name: "Örnek Hasta",
    city: "Yalova",
    treatment: "İmplant",
    text: "Tedavi öncesinde bütün aşamalar tek tek anlatıldı, ne olacağını bilerek başladım. Randevu saatlerine uyulması benim için en büyük fark oldu.",
    placeholder: true,
  },
  {
    name: "Örnek Hasta",
    city: "Yalova",
    treatment: "Ortodonti",
    text: "Şeffaf plak tedavim boyunca kontroller aksatılmadı. Klinikteki ekip her sorumu sabırla yanıtladı.",
    placeholder: true,
  },
  {
    name: "Örnek Hasta",
    city: "Çiftlikköy",
    treatment: "Çocuk diş hekimliği",
    text: "Çocuğum diş hekiminden çok korkuyordu. İlk randevuda hiçbir işlem yapılmadan sadece tanıştılar, ikinci randevuda tedaviyi ağlamadan tamamladık.",
    placeholder: true,
  },
];

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingMinutes: number;
  category: string;
  /** Basit paragraf/başlık/liste bloklarından oluşan gövde */
  body: (
    | { type: "p"; text: string }
    | { type: "h2"; text: string }
    | { type: "ul"; items: string[] }
  )[];
};

export const posts: Post[] = [
  {
    slug: "20-yas-disi-agrisi",
    title: "20 Yaş Dişi Ağrısı: Ne Zaman Çekilmeli?",
    excerpt:
      "Her yirmilik diş çekilmez. Hangi durumlarda beklemek, hangi durumlarda cerrahi çekim gerektiğini anlatıyoruz.",
    date: "2026-05-14",
    readingMinutes: 4,
    category: "Cerrahi",
    body: [
      {
        type: "p",
        text: "Yirmi yaş dişleri genellikle 17–25 yaş arasında sürer. Çene kemiğinde yeterli yer kalmadığında diş ya kısmen sürer ya da tamamen gömülü kalır. Bu noktada sık sorulan soru şudur: ağrı yapmıyorsa çektirmeli mi?",
      },
      { type: "h2", text: "Çekim gerektiren durumlar" },
      {
        type: "ul",
        items: [
          "Diş etinde tekrarlayan şişlik ve iltihap (perikoronit)",
          "Komşu azı dişinde çürük ya da kök erimesi başlaması",
          "Fırçalanamadığı için sürekli çürüyen, temizlenemeyen dişler",
          "Çevresinde röntgende kist ya da lezyon görülmesi",
          "Ortodontik tedavi planında yer kazanılması gerekmesi",
        ],
      },
      { type: "h2", text: "Beklenebilecek durumlar" },
      {
        type: "p",
        text: "Doğru konumda sürmüş, karşıt dişiyle düzgün kapanışa giren ve fırçayla temizlenebilen yirmi yaş dişlerinin çekilmesi gerekmez. Bu dişler düzenli kontrolle takip edilir.",
      },
      { type: "h2", text: "Çekim sonrası ilk 48 saat" },
      {
        type: "ul",
        items: [
          "İlk 24 saat ağzınızı çalkalamayın, pıhtının yerinde kalması iyileşmenin anahtarıdır.",
          "Yanağınıza aralıklarla soğuk uygulayın; şişlik ve morluk beklenen bir tepkidir.",
          "Sigara ve pipetle içmek pıhtıyı yerinden oynatır, kuru soket riskini artırır.",
          "Yumuşak ve ılık gıdalar tercih edin, sert ve sıcak yiyeceklerden kaçının.",
        ],
      },
      {
        type: "p",
        text: "Üçüncü günden sonra artan ağrı, ağızda kötü tat ya da 38 °C üzeri ateş varsa kliniğinizi arayın.",
      },
    ],
  },
  {
    slug: "implant-tedavisi-ne-kadar-surer",
    title: "İmplant Tedavisi Ne Kadar Sürer?",
    excerpt:
      "İmplant tedavisinin aşamaları, kemikle kaynaşma süreci ve toplam takvim hakkında bilmeniz gerekenler.",
    date: "2026-04-02",
    readingMinutes: 5,
    category: "İmplantoloji",
    body: [
      {
        type: "p",
        text: "İmplant tedavisinin süresi tek bir cerrahi randevudan ibaret değildir. Toplam takvim; kemik yoğunluğu, greft ihtiyacı ve iyileşme hızına göre kişiden kişiye değişir.",
      },
      { type: "h2", text: "Aşamalar ve tahmini süreler" },
      {
        type: "ul",
        items: [
          "Muayene ve planlama: 1 randevu (röntgen/tomografi dâhil)",
          "Cerrahi uygulama: tek diş için ortalama 30–45 dakika",
          "Osseointegrasyon (kemikle kaynaşma): 2–3 ay",
          "Ölçü ve üst yapı: 2–3 randevu, yaklaşık 1–2 hafta",
        ],
      },
      { type: "h2", text: "Süreyi uzatan etkenler" },
      {
        type: "p",
        text: "Çene kemiğinin hacmi yetersizse greftleme ya da sinüs lifting gerekir; bu durumda kaynaşma süresine birkaç ay eklenir. Kontrolsüz diyabet, sigara kullanımı ve diş eti hastalığı da iyileşmeyi yavaşlatan etkenlerdir.",
      },
      { type: "h2", text: "Bekleme sürecinde dişsiz kalır mıyım?" },
      {
        type: "p",
        text: "Hayır. Kaynaşma süresi boyunca estetik bölgede geçici protez ya da geçici kron kullanılabilir. Günlük yaşamınızı sürdürebilirsiniz.",
      },
    ],
  },
  {
    slug: "dis-beyazlatma-zararli-mi",
    title: "Diş Beyazlatma Zararlı mı?",
    excerpt:
      "Ofis tipi ve ev tipi beyazlatma arasındaki fark, hassasiyet ve internetteki 'doğal' yöntemlerin riskleri.",
    date: "2026-02-19",
    readingMinutes: 4,
    category: "Estetik",
    body: [
      {
        type: "p",
        text: "Hekim kontrolünde yapılan beyazlatma, mine dokusunu aşındırmaz. Jel mine tabakasındaki renk moleküllerini kimyasal olarak parçalar; dişten madde kaldırmaz.",
      },
      { type: "h2", text: "Ofis tipi ve ev tipi farkı" },
      {
        type: "ul",
        items: [
          "Ofis tipi: klinikte tek seansta, yüksek konsantrasyonlu jelle, diş eti korunarak uygulanır.",
          "Ev tipi: kişiye özel plak ve düşük konsantrasyonlu jelle, birkaç gün boyunca evde kullanılır.",
          "Kombine: önce klinikte başlanır, sonuç evde desteklenir.",
        ],
      },
      { type: "h2", text: "Hassasiyet normal mi?" },
      {
        type: "p",
        text: "İşlem sonrası 1–2 gün süren soğuk hassasiyeti sık görülür ve geçicidir. Hassasiyet giderici diş macunu ve florür uygulaması bu şikâyeti azaltır.",
      },
      { type: "h2", text: "İnternetteki yöntemlere dikkat" },
      {
        type: "p",
        text: "Karbonat, limon, sirke ve aktif kömür gibi yöntemler dişi beyazlatmaz; asidik ve aşındırıcı yapılarıyla mineyi kalıcı olarak inceltir. Mine inceldikçe altındaki sarı dentin daha çok görünür ve dişler zamanla daha sarı görünmeye başlar.",
      },
    ],
  },
  {
    slug: "cocukta-ilk-dis-hekimi-ziyareti",
    title: "Çocuklarda İlk Diş Hekimi Ziyareti Ne Zaman Olmalı?",
    excerpt:
      "İlk randevunun zamanlaması, çocuğu hazırlarken kullanılmaması gereken cümleler ve koruyucu uygulamalar.",
    date: "2026-01-08",
    readingMinutes: 3,
    category: "Çocuk Diş Hekimliği",
    body: [
      {
        type: "p",
        text: "İlk ziyaret için önerilen zaman, ilk süt dişinin sürmesinden sonraki altı ay ya da en geç birinci yaş günüdür. Bu randevunun amacı tedavi değil; ağız hijyeni alışkanlığını kurmak ve çocuğun kliniğe alışmasıdır.",
      },
      { type: "h2", text: "Çocuğu hazırlarken kaçınılması gerekenler" },
      {
        type: "ul",
        items: [
          "\"Acımayacak\", \"iğne yok\" gibi ifadeler — çocuğun aklına olmayan bir korkuyu getirir.",
          "Diş hekimini ödül ya da ceza aracı yapmak.",
          "Kendi kaygınızı yansıtan hikâyeler anlatmak.",
        ],
      },
      { type: "h2", text: "Koruyucu uygulamalar" },
      {
        type: "p",
        text: "Daimî azı dişleri sürdükten sonra uygulanan fissür örtücüler, dişin çiğneyici yüzeyindeki derin oluklara sızarak çürük riskini azaltır. Florür vernik uygulamaları da 6 ayda bir tekrarlanabilir.",
      },
    ],
  },
  {
    slug: "dis-eti-kanamasi",
    title: "Diş Eti Kanaması Neyin Habercisi?",
    excerpt:
      "Fırçalarken görülen kanama normal değildir. Gingivitis ile periodontitis arasındaki farkı ve erken müdahalenin önemini anlatıyoruz.",
    date: "2025-11-21",
    readingMinutes: 4,
    category: "Diş Eti Sağlığı",
    body: [
      {
        type: "p",
        text: "Sağlıklı bir diş eti fırçalarken kanamaz. Kanama, çoğu zaman diş eti kenarında biriken bakteri plağına bağlı iltihabın ilk belirtisidir.",
      },
      { type: "h2", text: "Gingivitis: geri döndürülebilir aşama" },
      {
        type: "p",
        text: "Bu aşamada iltihap yalnızca diş etiyle sınırlıdır. Diş taşı temizliği ve doğru fırçalama tekniğiyle diş eti birkaç hafta içinde sağlığına kavuşur.",
      },
      { type: "h2", text: "Periodontitis: kemik kaybı başlar" },
      {
        type: "p",
        text: "İltihap alt dokulara ilerlediğinde dişi çevreleyen kemik erimeye başlar. Kaybedilen kemik kendiliğinden geri gelmez; tedavi hastalığın ilerlemesini durdurmayı hedefler. Bu nedenle erken teşhis belirleyicidir.",
      },
      { type: "h2", text: "Ne zaman randevu almalısınız?" },
      {
        type: "ul",
        items: [
          "Fırçalarken düzenli kanama oluyorsa",
          "Diş etleriniz kızarık, şiş ya da hassassa",
          "Geçmeyen ağız kokusu varsa",
          "Dişlerinizin boyu uzamış gibi görünüyorsa (diş eti çekilmesi)",
          "Dişlerinizde sallanma ya da yer değiştirme fark ettiyseniz",
        ],
      },
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

/** ⚠️ verified: false — anlaşma listesi klinikten teyit edilmeli. */
export const partners = {
  verified: false,
  items: [
    {
      name: "Yalova Ticaret ve Sanayi Odası (YTSO)",
      note: "YTSO üyeleri, çalışanları ve birinci derece yakınları için indirim protokolü.",
      source: "Basın açıklaması, 2023",
    },
  ],
};
