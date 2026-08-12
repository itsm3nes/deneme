import type { IconName } from "@/components/site/Icons";

export type Treatment = {
  slug: string;
  title: string;
  /** Menü ve kartlarda kullanılan kısa ad */
  short: string;
  icon: IconName;
  /** Kart altı tek cümlelik özet */
  excerpt: string;
  /** Detay sayfası giriş paragrafı */
  intro: string;
  /** "Kimler için uygundur?" maddeleri */
  suitableFor: string[];
  /** Tedavi adımları */
  steps: { title: string; text: string }[];
  facts: { label: string; value: string }[];
  faq: { q: string; a: string }[];
  featured?: boolean;
};

/**
 * ⚠️ TASLAK NOTU: Tedavi listesi mevadis.com.tr'de duyurulan hizmet
 * başlıklarından derlendi. Metinler tanıtım amaçlı örnek içeriktir; süre ve
 * seans bilgileri hastadan hastaya değişir. Yayına almadan önce hekim onayından
 * geçirin — Sağlık Bakanlığı tanıtım mevzuatı gereği fiyat, garanti ve
 * "en iyi / tek" gibi ifadeler kullanılamaz.
 */
export const treatments: Treatment[] = [
  {
    slug: "implant",
    title: "İmplant Tedavisi",
    short: "İmplant",
    icon: "implant",
    excerpt:
      "Eksik dişin yerine çene kemiğine yerleştirilen titanyum vida ile doğala en yakın çözüm.",
    intro:
      "Diş implantı, kaybedilen dişin kökünün yerini alan titanyum bir vidadır. Çene kemiğine yerleştirilir, kemikle kaynaşma (osseointegrasyon) tamamlandıktan sonra üzerine kron yapılır. Komşu dişlerin aşındırılmasını gerektirmediği için tek diş eksikliğinde de, tam ağız restorasyonlarında da tercih edilir.",
    suitableFor: [
      "Tek diş, birden fazla diş ya da tüm dişlerini kaybetmiş kişiler",
      "Hareketli protez kullanmakta zorlanan hastalar",
      "Köprü için sağlam komşu dişlerini kestirmek istemeyenler",
      "Çene kemiği yeterli olan ya da greftleme ile desteklenebilecek hastalar",
    ],
    steps: [
      {
        title: "Muayene ve planlama",
        text: "Panoramik röntgen ve gerektiğinde 3B tomografi ile kemik hacmi, sinüs ve sinir konumu değerlendirilir.",
      },
      {
        title: "Cerrahi uygulama",
        text: "Lokal anestezi altında implant çene kemiğine yerleştirilir. İşlem tek diş için ortalama 30–45 dakika sürer.",
      },
      {
        title: "İyileşme süreci",
        text: "İmplantın kemikle kaynaşması için genellikle 2–3 ay beklenir. Bu sürede geçici protez kullanılabilir.",
      },
      {
        title: "Üst yapı",
        text: "Ölçü alınarak zirkonyum ya da porselen kron hazırlanır ve implant üzerine sabitlenir.",
      },
    ],
    facts: [
      { label: "Anestezi", value: "Lokal anestezi" },
      { label: "Cerrahi süresi", value: "Tek diş için 30–45 dk" },
      { label: "Toplam süre", value: "Ortalama 2–4 ay" },
      { label: "Kontrol", value: "6 ayda bir önerilir" },
    ],
    faq: [
      {
        q: "İmplant yaptırmak acı verir mi?",
        a: "İşlem lokal anestezi altında yapılır, cerrahi sırasında ağrı hissedilmez. Sonrasında oluşabilecek hafif hassasiyet hekiminizin önereceği ağrı kesicilerle kontrol altına alınır.",
      },
      {
        q: "İmplant için yaş sınırı var mı?",
        a: "Çene kemiği gelişimini tamamlamış her sağlıklı yetişkine uygulanabilir. Üst yaş sınırı yoktur; belirleyici olan genel sağlık durumu ve kemik yapısıdır.",
      },
      {
        q: "Sigara kullanımı implantı etkiler mi?",
        a: "Sigara iyileşmeyi yavaşlatır ve implant çevresinde doku sorunu riskini artırır. Tedavi süresince azaltılması ya da bırakılması önerilir.",
      },
    ],
    featured: true,
  },
  {
    slug: "ortodonti",
    title: "Ortodonti — Diş Teli ve Şeffaf Plak",
    short: "Ortodonti",
    icon: "braces",
    excerpt:
      "Çapraşık dişler ve kapanış bozuklukları için metal, seramik braket veya şeffaf plak seçenekleri.",
    intro:
      "Ortodonti; dişlerin ve çenelerin konumunu düzelten uzmanlık alanıdır. Çapraşıklık, diastema (diş arası boşluk), açık ya da derin kapanış gibi sorunlar hem estetik hem de çiğneme fonksiyonu ve diş eti sağlığı açısından tedavi edilir. Tedavi metal braket, seramik (şeffaf) braket ya da görünmez plak (aligner) ile yürütülebilir.",
    suitableFor: [
      "Çapraşık, dönük ya da aralıklı dişleri olan çocuk ve yetişkinler",
      "Alt–üst çene uyumsuzluğu (kapanış bozukluğu) bulunan hastalar",
      "Protez veya implant öncesi diş dizisinin düzenlenmesi gereken durumlar",
      "Braket görüntüsü istemeyen, şeffaf plak tercih eden yetişkinler",
    ],
    steps: [
      {
        title: "Ortodontik analiz",
        text: "Ağız içi fotoğraf, ölçü, panoramik ve sefalometrik röntgenlerle iskeletsel ve dişsel yapı incelenir.",
      },
      {
        title: "Tedavi planı",
        text: "Braket türü, çekimli/çekimsiz yaklaşım ve tahmini süre hastayla birlikte belirlenir.",
      },
      {
        title: "Aktif tedavi",
        text: "Braketler yapıştırılır ya da plak serisi teslim edilir. 4–8 haftada bir kontrol randevusu verilir.",
      },
      {
        title: "Pekiştirme",
        text: "Tedavi bitince dişlerin yerinde kalması için sabit ya da hareketli pekiştirme apareyi kullanılır.",
      },
    ],
    facts: [
      { label: "Başlangıç yaşı", value: "7 yaşından itibaren değerlendirme" },
      { label: "Ortalama süre", value: "12–24 ay" },
      { label: "Kontrol sıklığı", value: "4–8 haftada bir" },
      { label: "Seçenekler", value: "Metal · Seramik · Şeffaf plak" },
    ],
    faq: [
      {
        q: "Yetişkinlikte diş teli takılır mı?",
        a: "Evet. Diş eti ve kemik desteği sağlıklı olduğu sürece ortodontik tedavinin üst yaş sınırı yoktur. Yetişkinlerde seramik braket ve şeffaf plak sıkça tercih edilir.",
      },
      {
        q: "Şeffaf plak mı, braket mi daha etkili?",
        a: "Her ikisi de doğru endikasyonda başarılıdır. Karmaşık kapanış bozukluklarında braket, hafif–orta düzey çapraşıklıklarda şeffaf plak öne çıkar. Karar ortodontik analizle verilir.",
      },
    ],
    featured: true,
  },
  {
    slug: "zirkonyum-kaplama",
    title: "Zirkonyum Kaplama",
    short: "Zirkonyum",
    icon: "crown",
    excerpt:
      "Metal desteksiz, ışık geçirgenliği doğal dişe yakın estetik kron ve köprü çözümü.",
    intro:
      "Zirkonyum; metal altyapı kullanılmadan hazırlanan, beyaz renkli ve dayanıklı bir alt yapı malzemesidir. Işığı doğal diş gibi geçirdiği için diş etinde gri yansıma bırakmaz. Aşırı madde kaybı olan, kanal tedavili ya da renklenmiş dişlerde hem ön hem arka bölgede kullanılabilir. Çiğneme kuvvetinin yüksek olduğu bölgelerde monolitik zirkonyum tercih edilir.",
    suitableFor: [
      "Renklenmiş, şekli bozuk ya da aşınmış dişler",
      "Kanal tedavisi görmüş, kırılma riski taşıyan dişler",
      "Metal destekli porselende diş eti kenarında koyu çizgi oluşan hastalar",
      "İmplant üstü kron ve köprü uygulamaları",
    ],
    steps: [
      {
        title: "Diş hazırlığı",
        text: "Lokal anestezi altında diş, kaplamanın oturacağı kalınlıkta aşındırılır.",
      },
      {
        title: "Dijital/klasik ölçü",
        text: "Ağız içi tarayıcı ya da ölçü maddesiyle hassas ölçü alınır, renk seçimi yapılır.",
      },
      {
        title: "Geçici kaplama",
        text: "Laboratuvar aşamasında dişi korumak için geçici kron takılır.",
      },
      {
        title: "Prova ve yapıştırma",
        text: "Uyum ve renk provası sonrası kaplama kalıcı simanla yapıştırılır.",
      },
    ],
    facts: [
      { label: "Randevu sayısı", value: "Ortalama 2–3 seans" },
      { label: "Tamamlanma", value: "5–7 gün" },
      { label: "Alternatif", value: "Monolitik zirkonyum · E-max" },
      { label: "Bakım", value: "Normal fırçalama + ara yüz temizliği" },
    ],
    faq: [
      {
        q: "Zirkonyum kaplama ne kadar dayanır?",
        a: "Ağız hijyeni iyi olan ve düzenli kontrole gelen hastalarda uzun yıllar kullanılabilir. Ömrü; sıkma-gıcırdatma alışkanlığı, diş eti sağlığı ve bakıma bağlı olarak değişir.",
      },
      {
        q: "Zirkonyum alerji yapar mı?",
        a: "Metal içermediği için metal alerjisi olan hastalarda güvenle tercih edilebilir.",
      },
    ],
    featured: true,
  },
  {
    slug: "gulus-tasarimi",
    title: "Gülüş Tasarımı",
    short: "Gülüş Tasarımı",
    icon: "smile",
    excerpt:
      "Yüz hatları, dudak çizgisi ve diş eti seviyesi birlikte planlanarak kişiye özel gülüş.",
    intro:
      "Gülüş tasarımı tek bir işlem değil, birden fazla tedavinin ortak planıdır. Dişlerin boyu, genişliği, orta hattı, diş eti seviyesi ve dudak hareketi birlikte değerlendirilir; sonuç dijital ortamda ya da mum modelaj (mock-up) ile önceden gösterilir. Plana göre laminate veneer, zirkonyum, beyazlatma, diş eti estetiği veya ortodonti birlikte kullanılabilir.",
    suitableFor: [
      "Gülümserken diş etleri fazla görünen (gummy smile) hastalar",
      "Dişleri arasında boşluk, kırık veya aşınma bulunanlar",
      "Renk ve form uyumsuzluğundan rahatsız olanlar",
      "Eski kaplamalarını yenilemek isteyenler",
    ],
    steps: [
      {
        title: "Analiz ve fotoğraflama",
        text: "Yüz ve gülüş fotoğrafları, ağız içi tarama ve gerekli röntgenler alınır.",
      },
      {
        title: "Dijital tasarım",
        text: "Yeni gülüş bilgisayar ortamında tasarlanır, hastayla birlikte üzerinde çalışılır.",
      },
      {
        title: "Prova (mock-up)",
        text: "Tasarım geçici materyalle ağza uygulanır; hasta sonucu kesim öncesi görür.",
      },
      {
        title: "Uygulama",
        text: "Onaylanan plana göre restorasyonlar hazırlanır ve yapıştırılır.",
      },
    ],
    facts: [
      { label: "Planlama", value: "Dijital tasarım + mock-up" },
      { label: "Süre", value: "Kapsama göre 1–3 hafta" },
      { label: "Kapsam", value: "Veneer · Zirkonyum · Beyazlatma · Diş eti" },
      { label: "Ön koşul", value: "Sağlıklı diş eti ve çürüksüz ağız" },
    ],
    faq: [
      {
        q: "Gülüş tasarımında dişlerim kesilir mi?",
        a: "Plana bağlıdır. Sadece beyazlatma ve kompozit uygulanan vakalarda kesim gerekmez; laminate veneer için minimal, zirkonyum için daha belirgin bir hazırlık yapılır.",
      },
      {
        q: "Sonucu önceden görebilir miyim?",
        a: "Evet. Mock-up aşamasında yeni dişler geçici olarak ağzınıza uygulanır ve aynada değerlendirebilirsiniz.",
      },
    ],
    featured: true,
  },
  {
    slug: "laminate-veneer",
    title: "Laminate Veneer (Yaprak Porselen)",
    short: "Laminate Veneer",
    icon: "veneer",
    excerpt:
      "Dişin ön yüzeyine yapıştırılan ince porselen yapraklarla minimum kesimle estetik.",
    intro:
      "Laminate veneer, dişin yalnızca ön yüzeyine yapıştırılan 0,3–0,7 mm kalınlığında porselen laminalardır. Diş dokusundan çok az madde kaldırıldığı için konservatif bir estetik yöntemdir. Renk, form ve küçük pozisyon bozukluklarını düzeltmek için kullanılır.",
    suitableFor: [
      "Beyazlatmaya yanıt vermeyen kalıcı renklenmeler",
      "Ön dişlerde küçük kırık, aşınma ve şekil bozuklukları",
      "Diş arası boşlukların (diastema) kapatılması",
      "Hafif düzeyde çapraşıklığın ortodonti olmadan maskelenmesi",
    ],
    steps: [
      {
        title: "Estetik planlama",
        text: "Gülüş analizi yapılır, renk ve form üzerinde anlaşılır.",
      },
      {
        title: "Minimal hazırlık",
        text: "Dişin ön yüzeyinden çok ince bir tabaka kaldırılır, ölçü alınır.",
      },
      {
        title: "Laboratuvar üretimi",
        text: "Porselen laminalar kişiye özel üretilir; bu sürede geçici uygulanabilir.",
      },
      {
        title: "Adeziv yapıştırma",
        text: "Laminalar özel bonding sistemiyle diş yüzeyine yapıştırılır.",
      },
    ],
    facts: [
      { label: "Kalınlık", value: "0,3 – 0,7 mm" },
      { label: "Randevu", value: "2–3 seans" },
      { label: "Süre", value: "Ortalama 7–10 gün" },
      { label: "Bölge", value: "Genellikle ön dişler" },
    ],
    faq: [
      {
        q: "Laminate veneer kırılır mı?",
        a: "Yapıştırıldıktan sonra diş dokusuyla bütünleşir ve normal çiğneme kuvvetlerine dayanır. Sert cisim ısırmak, tırnak yemek ya da gece diş sıkmak kırılma riskini artırır; gerekirse gece plağı önerilir.",
      },
      {
        q: "Veneer sonrası leke tutar mı?",
        a: "Porselen yüzey gözeneksizdir; çay, kahve ve sigara lekelerine doğal dişten daha dirençlidir.",
      },
    ],
  },
  {
    slug: "dis-beyazlatma",
    title: "Diş Beyazlatma (Bleaching)",
    short: "Diş Beyazlatma",
    icon: "sparkle",
    excerpt:
      "Klinikte tek seansta ya da ev tipi plaklarla dişlerin doğal renginin açılması.",
    intro:
      "Beyazlatma, diş yüzeyindeki ve mine içindeki renklenmelerin kimyasal olarak açılmasıdır. Klinikte uygulanan ofis tipi beyazlatma tek seansta belirgin sonuç verirken, ev tipi beyazlatmada kişiye özel plaklarla jel birkaç gün boyunca kullanılır. İkisi birlikte de planlanabilir.",
    suitableFor: [
      "Çay, kahve, sigara kaynaklı yüzey renklenmeleri",
      "Yaşa bağlı doğal sararma",
      "Özel bir gün öncesi hızlı renk açma isteyenler",
      "Diş eti ve dişleri sağlıklı, çürüğü tedavi edilmiş hastalar",
    ],
    steps: [
      {
        title: "Ön kontrol",
        text: "Çürük, kırık ve diş eti sorunları varsa önce tedavi edilir.",
      },
      {
        title: "Diş taşı temizliği",
        text: "Yüzey birikintileri kaldırılarak jelin eşit etki etmesi sağlanır.",
      },
      {
        title: "Uygulama",
        text: "Diş eti koruyucu bariyer sonrası beyazlatma jeli uygulanır ve ışıkla aktive edilir.",
      },
      {
        title: "Bakım önerileri",
        text: "İlk 48 saat renklendirici gıda ve içeceklerden kaçınmanız istenir.",
      },
    ],
    facts: [
      { label: "Ofis tipi", value: "Tek seans, 45–60 dk" },
      { label: "Ev tipi", value: "5–10 gün, günde 4–6 saat" },
      { label: "Kalıcılık", value: "Beslenme alışkanlığına göre değişir" },
      { label: "Hassasiyet", value: "Geçici, 1–2 gün sürebilir" },
    ],
    faq: [
      {
        q: "Beyazlatma dişe zarar verir mi?",
        a: "Hekim kontrolünde, uygun konsantrasyonda yapılan beyazlatma mine yapısına zarar vermez. Geçici hassasiyet görülebilir ve kısa sürede geçer.",
      },
      {
        q: "Kaplama ve dolgularım da beyazlar mı?",
        a: "Hayır. Porselen ve kompozit restorasyonlar beyazlatma jelinden etkilenmez; renk uyumu için sonradan yenilenmeleri gerekebilir.",
      },
    ],
    featured: true,
  },
  {
    slug: "kanal-tedavisi",
    title: "Kanal Tedavisi (Endodonti)",
    short: "Kanal Tedavisi",
    icon: "root",
    excerpt:
      "İltihaplı diş sinirinin temizlenip kanalların doldurulmasıyla dişin ağızda kalması.",
    intro:
      "Çürüğün ya da travmanın diş sinirine ulaştığı durumlarda diş çekilmeden kurtarılabilir. Kanal tedavisinde iltihaplı pulpa dokusu çıkarılır, kanallar şekillendirilip dezenfekte edilir ve sızdırmaz bir dolgu maddesiyle doldurulur. Tedavi sonrası diş genellikle kron ile desteklenir.",
    suitableFor: [
      "Gece artan, kendiliğinden başlayan diş ağrısı",
      "Sıcak–soğuğa uzun süren hassasiyet",
      "Diş eti üzerinde apse veya şişlik",
      "Travma sonucu kırılmış, siniri açığa çıkmış dişler",
    ],
    steps: [
      {
        title: "Teşhis",
        text: "Klinik muayene ve periapikal röntgen ile dişin durumu belirlenir.",
      },
      {
        title: "Kanal temizliği",
        text: "Lokal anestezi altında sinir dokusu çıkarılır, kanallar eğelenerek genişletilir.",
      },
      {
        title: "Dezenfeksiyon",
        text: "Kanallar yıkanır; gerekirse birkaç gün kanal içi ilaç bırakılır.",
      },
      {
        title: "Dolum ve restorasyon",
        text: "Kanallar doldurulur, diş üstü dolgu ya da kron ile kapatılır.",
      },
    ],
    facts: [
      { label: "Seans", value: "1–3 randevu" },
      { label: "Randevu süresi", value: "45–90 dk" },
      { label: "Anestezi", value: "Lokal anestezi" },
      { label: "Sonrası", value: "Kron ile güçlendirme önerilir" },
    ],
    faq: [
      {
        q: "Kanal tedavisi ağrılı mıdır?",
        a: "Tedavi lokal anestezi altında yapılır, işlem sırasında ağrı hissedilmez. Asıl ağrıyı yaratan iltihabın temizlenmesi genellikle şikâyeti hızla azaltır.",
      },
      {
        q: "Kanal tedavili diş kararır mı?",
        a: "Zamanla renk değişimi olabilir. Bu durumda diş içi beyazlatma ya da estetik kaplama ile renk düzeltilir.",
      },
    ],
  },
  {
    slug: "estetik-dolgu",
    title: "Estetik Dolgu (Kompozit)",
    short: "Estetik Dolgu",
    icon: "filling",
    excerpt:
      "Diş rengiyle birebir uyumlu kompozit malzemeyle tek seansta çürük ve kırık onarımı.",
    intro:
      "Kompozit dolgular, diş renginde ışıkla sertleşen malzemelerdir. Çürük temizlendikten sonra tabakalar hâlinde uygulanır ve dişin doğal formu yeniden oluşturulur. Amalgam dolgulara göre daha az sağlam doku kaldırılmasını gerektirir ve estetik olarak fark edilmez.",
    suitableFor: [
      "Ön ve arka bölge çürükleri",
      "Kırık ya da aşınmış diş kenarları",
      "Ön dişlerdeki küçük şekil bozuklukları (bonding)",
      "Eski, renklenmiş amalgam dolguların yenilenmesi",
    ],
    steps: [
      {
        title: "Çürük temizliği",
        text: "Gerekirse lokal anestezi ile çürük doku tamamen uzaklaştırılır.",
      },
      {
        title: "Yüzey hazırlığı",
        text: "Asitleme ve bonding uygulanarak dolgunun dişe tutunması sağlanır.",
      },
      {
        title: "Tabakalama",
        text: "Kompozit katmanlar hâlinde yerleştirilip ışıkla sertleştirilir.",
      },
      {
        title: "Cila",
        text: "Kapanış kontrolü yapılır, yüzey parlatılarak leke tutması azaltılır.",
      },
    ],
    facts: [
      { label: "Süre", value: "Diş başına 20–40 dk" },
      { label: "Seans", value: "Tek seans" },
      { label: "Renk", value: "Diş rengiyle eşleştirilir" },
      { label: "Sonrası", value: "Hemen yemek yenebilir" },
    ],
    faq: [
      {
        q: "Dolgu sonrası hassasiyet normal mi?",
        a: "Derin çürüklerde birkaç gün sürebilen soğuk hassasiyeti görülebilir. Geçmeyen ya da artan ağrıda kontrole gelmeniz gerekir.",
      },
    ],
  },
  {
    slug: "porselen-dolgu",
    title: "Porselen Dolgu (Inlay / Onlay)",
    short: "Porselen Dolgu",
    icon: "inlay",
    excerpt:
      "Madde kaybı fazla olan arka dişlerde laboratuvarda üretilen dayanıklı porselen restorasyon.",
    intro:
      "Çürük ya da kırık nedeniyle madde kaybı klasik dolgunun sınırını aştığında, ancak diş kron yapılacak kadar zayıflamadığında porselen inlay/onlay tercih edilir. Ölçü alınarak laboratuvarda üretilir, aşınma direnci ve kenar uyumu yüksektir.",
    suitableFor: [
      "Geniş çürük nedeniyle duvarları zayıflamış azı dişleri",
      "Tekrarlayan dolgu kırıkları yaşayan hastalar",
      "Kanal tedavisi sonrası desteklenmesi gereken dişler",
    ],
    steps: [
      {
        title: "Kavite hazırlığı",
        text: "Çürük temizlenir, restorasyonun oturacağı form verilir.",
      },
      { title: "Ölçü", text: "Dijital tarama ya da klasik ölçü alınır." },
      {
        title: "Üretim",
        text: "Porselen restorasyon laboratuvarda hazırlanır; ara dönemde geçici dolgu yapılır.",
      },
      {
        title: "Yapıştırma",
        text: "Uyum kontrolü sonrası adeziv sistemle simante edilir.",
      },
    ],
    facts: [
      { label: "Seans", value: "2 randevu" },
      { label: "Süre", value: "3–7 gün" },
      { label: "Dayanım", value: "Kompozit dolguya göre yüksek" },
      { label: "Bölge", value: "Genellikle azı dişleri" },
    ],
    faq: [
      {
        q: "Porselen dolgu ile kaplama arasındaki fark nedir?",
        a: "Inlay/onlay dişin yalnızca kayıp bölümünü onarır; kaplama ise dişi tümüyle sarar. Sağlam doku miktarı yeterliyse inlay/onlay daha koruyucudur.",
      },
    ],
  },
  {
    slug: "protez",
    title: "Protez Diş Tedavisi",
    short: "Protez",
    icon: "denture",
    excerpt:
      "Total, bölümlü ve implant üstü protezlerle çiğneme fonksiyonunun yeniden kazandırılması.",
    intro:
      "Diş eksikliklerinde çiğneme, konuşma ve yüz desteğini yeniden sağlamak için sabit ya da hareketli protezler uygulanır. Tüm dişlerin eksik olduğu durumlarda total protez, bir kısmının eksik olduğu durumlarda bölümlü protez; tutuculuğun artırılması istendiğinde implant üstü protez planlanır.",
    suitableFor: [
      "Tam veya kısmi diş eksikliği bulunan hastalar",
      "Mevcut protezinde tutuculuk sorunu yaşayanlar",
      "İmplant destekli sabit çözüm isteyen hastalar",
    ],
    steps: [
      {
        title: "Ağız içi değerlendirme",
        text: "Kalan dişler, kemik ve dişeti dokusu incelenerek protez tipi belirlenir.",
      },
      {
        title: "Ölçü ve kayıtlar",
        text: "Çene ilişkisi kaydedilir, kişiye özel model hazırlanır.",
      },
      {
        title: "Prova",
        text: "Diş dizimi provası yapılır; renk, form ve kapanış hastayla birlikte onaylanır.",
      },
      {
        title: "Teslim ve uyum",
        text: "Protez teslim edilir, ilk günlerde uyum kontrolleri yapılır.",
      },
    ],
    facts: [
      { label: "Seans", value: "4–6 randevu" },
      { label: "Süre", value: "2–4 hafta" },
      { label: "Tipler", value: "Total · Bölümlü · İmplant üstü" },
      { label: "Kontrol", value: "Yılda bir kez önerilir" },
    ],
    faq: [
      {
        q: "Yeni proteze alışmak ne kadar sürer?",
        a: "İlk günlerde konuşma ve çiğnemede yabancılık hissi normaldir. Genellikle 2–4 hafta içinde uyum sağlanır; bu süreçte uyum kontrolleri önemlidir.",
      },
    ],
  },
  {
    slug: "periodontoloji",
    title: "Diş Eti Tedavisi (Periodontoloji)",
    short: "Diş Eti Tedavisi",
    icon: "gum",
    excerpt:
      "Kanayan, çekilen diş etleri ve diş kaybına yol açan periodontal hastalıkların tedavisi.",
    intro:
      "Diş eti hastalıkları, dişleri destekleyen doku ve kemiği etkileyerek diş kaybının en sık nedenlerinden biri hâline gelir. Erken dönemde (gingivitis) diş taşı temizliğiyle geriye döndürülebilir; ilerlemiş vakalarda (periodontitis) kapalı/açık küretaj ve cerrahi yaklaşımlar gerekir.",
    suitableFor: [
      "Fırçalarken diş eti kanaması yaşayanlar",
      "Ağız kokusu ve diş eti çekilmesi şikâyeti olanlar",
      "Dişlerinde sallanma hisseden hastalar",
      "İmplant öncesi diş eti sağlığının düzenlenmesi gereken durumlar",
    ],
    steps: [
      {
        title: "Periodontal muayene",
        text: "Cep derinlikleri ölçülür, kemik seviyesi röntgenle değerlendirilir.",
      },
      {
        title: "Detertraj ve kök yüzeyi düzleştirme",
        text: "Diş taşı ve plak, diş eti üstü ve altından temizlenir.",
      },
      {
        title: "Cerrahi tedavi",
        text: "Gerekli vakalarda açık küretaj, greft veya diş eti estetiği uygulanır.",
      },
      {
        title: "İdame",
        text: "3–6 ayda bir kontrol ile hastalığın tekrarı önlenir.",
      },
    ],
    facts: [
      { label: "İlk aşama", value: "Diş taşı temizliği" },
      { label: "Seans", value: "Yaygınlığa göre 1–4" },
      { label: "İdame", value: "3–6 ayda bir" },
      { label: "Belirti", value: "Kanama · Kızarıklık · Kötü ağız kokusu" },
    ],
    faq: [
      {
        q: "Diş eti çekilmesi geri döner mi?",
        a: "Çekilen diş eti kendiliğinden eski seviyesine dönmez; ancak ilerlemesi durdurulabilir ve uygun vakalarda greft ile örtülebilir.",
      },
    ],
  },
  {
    slug: "pedodonti",
    title: "Çocuk Diş Hekimliği (Pedodonti)",
    short: "Çocuk Diş Hekimliği",
    icon: "child",
    excerpt:
      "Süt dişi tedavileri, fissür örtücü ve florür uygulamalarıyla korkusuz ilk deneyim.",
    intro:
      "Pedodonti; 0–14 yaş grubunun ağız ve diş sağlığıyla ilgilenir. Süt dişleri kalıcı dişlerin yer tutucusu olduğundan erken kayıpları ileride çapraşıklığa yol açabilir. Koruyucu uygulamalar (fissür örtücü, florür) ve çocuğun hekime alışmasını sağlayan davranış yönlendirmesi tedavinin temelidir.",
    suitableFor: [
      "İlk diş çıktıktan sonraki ilk kontroller",
      "Süt dişi çürüğü ve travma sonrası kırıklar",
      "Erken diş kaybında yer tutucu ihtiyacı",
      "Parmak emme, gece diş gıcırdatma alışkanlıkları",
    ],
    steps: [
      {
        title: "Tanışma randevusu",
        text: "Çocuğa aletler tanıtılır, işlem yapılmadan kliniğe alışması sağlanır.",
      },
      {
        title: "Muayene",
        text: "Çürük, sürme sırası ve çene gelişimi değerlendirilir.",
      },
      {
        title: "Koruyucu uygulamalar",
        text: "Fissür örtücü ve florür ile çürük riski azaltılır.",
      },
      {
        title: "Tedavi ve takip",
        text: "Gerekli dolgu/kanal tedavileri yapılır, 6 ayda bir kontrol planlanır.",
      },
    ],
    facts: [
      { label: "İlk ziyaret", value: "İlk diş çıkınca / 1 yaş" },
      { label: "Kontrol", value: "6 ayda bir" },
      { label: "Koruyucu", value: "Fissür örtücü · Florür" },
      { label: "Yaklaşım", value: "Davranış yönlendirme odaklı" },
    ],
    faq: [
      {
        q: "Süt dişi çürüğü tedavi edilmeli mi?",
        a: "Evet. Süt dişleri hem çiğneme hem de kalıcı dişin yerini koruma görevi görür. Tedavi edilmeyen çürükler ağrıya, enfeksiyona ve kalıcı dişte sorunlara yol açabilir.",
      },
      {
        q: "Çocuğumu ilk kez nasıl hazırlamalıyım?",
        a: "\"Acımayacak\", \"iğne yok\" gibi ifadeler yerine tarafsız bir dil kullanın. Randevuyu ödül ya da tehdit aracı yapmamak, çocuğun kliniği olumlu tanımasına yardımcı olur.",
      },
    ],
  },
  {
    slug: "agiz-dis-cene-cerrahisi",
    title: "Ağız, Diş ve Çene Cerrahisi",
    short: "Çene Cerrahisi",
    icon: "surgery",
    excerpt:
      "Gömülü diş çekimi, apse, kist operasyonları ve implant öncesi kemik uygulamaları.",
    intro:
      "Ağız, diş ve çene cerrahisi; gömülü diş çekimi, cerrahi diş çekimi, çene kistlerinin çıkarılması, apse drenajı ve implant öncesi kemik greftleme–sinüs lifting gibi işlemleri kapsar. İşlemler lokal anestezi altında, gerekli vakalarda sedasyon desteğiyle yapılır.",
    suitableFor: [
      "Gömülü ya da yarı gömülü 20 yaş dişi bulunan hastalar",
      "Normal yöntemle çekilemeyen kırık kök ve dişler",
      "Çene kemiğinde kist ya da lezyon saptanan hastalar",
      "İmplant için kemik hacmi yetersiz olan hastalar",
    ],
    steps: [
      {
        title: "Radyolojik değerlendirme",
        text: "Panoramik röntgen, gerekirse 3B tomografi ile anatomik yapılar incelenir.",
      },
      {
        title: "Operasyon planı",
        text: "İşlem, anestezi tipi ve iyileşme süreci hastayla paylaşılır.",
      },
      {
        title: "Cerrahi işlem",
        text: "Steril koşullarda operasyon yapılır, gerekirse dikiş atılır.",
      },
      {
        title: "Kontrol",
        text: "7–10 gün sonra dikişler alınır ve iyileşme değerlendirilir.",
      },
    ],
    facts: [
      { label: "Anestezi", value: "Lokal (gerekirse sedasyon)" },
      { label: "İşlem süresi", value: "20–60 dk" },
      { label: "Dikiş", value: "7–10 gün sonra alınır" },
      { label: "İyileşme", value: "Ortalama 1 hafta" },
    ],
    faq: [
      {
        q: "Gömülü diş çekimi sonrası şişlik olur mu?",
        a: "İlk 48 saatte şişlik ve hafif morluk beklenen bir tepkidir. Soğuk uygulama ve hekiminizin önerdiği ilaçlarla kontrol altına alınır.",
      },
      {
        q: "İşlemden sonra ne yemeliyim?",
        a: "İlk gün ılık–soğuk, yumuşak gıdalar tercih edilmeli; sıcak, sert ve baharatlı yiyeceklerden, sigaradan ve pipetle içmekten kaçınılmalıdır.",
      },
    ],
  },
  {
    slug: "yirmilik-dis-cekimi",
    title: "20 Yaş Dişi Çekimi",
    short: "20'lik Diş",
    icon: "tooth",
    excerpt:
      "Ağrı yapan, çapraşıklığa ya da enfeksiyona yol açan yirmi yaş dişlerinin çekimi.",
    intro:
      "Yirmi yaş dişleri çenede yeterli yer bulamadığında gömülü kalabilir, komşu dişe baskı yapabilir ve tekrarlayan enfeksiyona (perikoronit) neden olabilir. Her yirmi yaş dişinin çekilmesi gerekmez; karar röntgen bulguları ve şikâyetlere göre verilir.",
    suitableFor: [
      "Tekrarlayan diş eti şişliği ve ağrı yaşayanlar",
      "Komşu azı dişinde çürük ya da kök erimesi başlamış hastalar",
      "Ortodontik tedavi öncesi yer kazanılması gereken vakalar",
      "Fırçalanamadığı için sürekli çürüyen dişler",
    ],
    steps: [
      {
        title: "Röntgen ve muayene",
        text: "Dişin konumu, kök şekli ve sinire yakınlığı değerlendirilir.",
      },
      {
        title: "Anestezi",
        text: "Bölge lokal anestezi ile tamamen uyuşturulur.",
      },
      {
        title: "Çekim",
        text: "Gömülü dişlerde küçük bir cerrahi yaklaşımla diş çıkarılır.",
      },
      {
        title: "İyileşme takibi",
        text: "Yara bakımı anlatılır, kontrol randevusu verilir.",
      },
    ],
    facts: [
      { label: "Süre", value: "20–45 dk" },
      { label: "Anestezi", value: "Lokal anestezi" },
      { label: "İş dönüşü", value: "Genellikle ertesi gün" },
      { label: "Kontrol", value: "1 hafta sonra" },
    ],
    faq: [
      {
        q: "Her 20 yaş dişi çekilmeli mi?",
        a: "Hayır. Doğru konumda sürmüş, karşıt dişiyle kapanışa giren ve temizlenebilen yirmi yaş dişleri ağızda bırakılabilir.",
      },
    ],
  },
  {
    slug: "dis-tasi-temizligi",
    title: "Diş Taşı Temizliği (Detertraj)",
    short: "Diş Taşı Temizliği",
    icon: "clean",
    excerpt:
      "Ultrasonik cihazlarla plak ve tartar temizliği; diş eti sağlığının ilk adımı.",
    intro:
      "Fırçalamayla uzaklaştırılamayan bakteri plağı zamanla sertleşerek diş taşına dönüşür. Diş taşı diş eti iltihabına, kanamaya ve ağız kokusuna yol açar. Ultrasonik uçlarla yapılan temizlik dişe zarar vermez; işlem sonrası yüzey cilalanarak yeni plak birikimi geciktirilir.",
    suitableFor: [
      "Diş eti kanaması ve ağız kokusu şikâyeti olanlar",
      "Sigara ve koyu içecek kullanımına bağlı renklenmesi olanlar",
      "6–12 ayda bir rutin bakım isteyen herkes",
      "Ortodontik tedavi ve implant öncesi hazırlık",
    ],
    steps: [
      {
        title: "Muayene",
        text: "Diş eti durumu ve birikim miktarı değerlendirilir.",
      },
      {
        title: "Ultrasonik temizlik",
        text: "Diş taşları titreşimli uçlarla kırılarak uzaklaştırılır.",
      },
      {
        title: "Cila",
        text: "Yüzey parlatılarak plak tutunması azaltılır.",
      },
      {
        title: "Hijyen eğitimi",
        text: "Fırçalama tekniği, ara yüz fırçası ve diş ipi kullanımı gösterilir.",
      },
    ],
    facts: [
      { label: "Süre", value: "30–45 dk" },
      { label: "Sıklık", value: "6–12 ayda bir" },
      { label: "Anestezi", value: "Genellikle gerekmez" },
      { label: "Sonrası", value: "Kısa süreli hassasiyet olabilir" },
    ],
    faq: [
      {
        q: "Diş taşı temizliği dişleri aşındırır mı?",
        a: "Hayır. Ultrasonik uçlar diş taşını kırar, mine dokusunu kesmez. Temizlik sonrası hissedilen pürüzsüzlük ve geçici hassasiyet normaldir.",
      },
      {
        q: "Temizlikten sonra dişlerim beyazlar mı?",
        a: "Yüzeydeki lekeler kalktığı için dişler daha açık görünür; ancak bu bir beyazlatma işlemi değildir, dişin doğal rengi değişmez.",
      },
    ],
  },
  {
    slug: "agiz-dis-cene-radyolojisi",
    title: "Muayene ve Ağız–Diş–Çene Radyolojisi",
    short: "Muayene & Röntgen",
    icon: "xray",
    excerpt:
      "Dijital panoramik ve periapikal görüntülemeyle düşük dozda ayrıntılı teşhis.",
    intro:
      "Doğru tedavi doğru teşhisle başlar. Klinik muayeneye ek olarak dijital röntgen; çürüklerin, kemik seviyesinin, gömülü dişlerin ve kist–lezyonların görüntülenmesini sağlar. Dijital sistemlerde radyasyon dozu klasik filme göre belirgin şekilde düşüktür ve görüntü anında değerlendirilebilir.",
    suitableFor: [
      "İlk kez kliniğe gelen her hasta için rutin değerlendirme",
      "İmplant ve cerrahi planlaması yapılacak hastalar",
      "Ortodontik tedavi öncesi analiz",
      "Ağrının kaynağının klinik olarak belirlenemediği durumlar",
    ],
    steps: [
      {
        title: "Anamnez",
        text: "Şikâyetiniz, sistemik hastalıklarınız ve kullandığınız ilaçlar kaydedilir.",
      },
      {
        title: "Klinik muayene",
        text: "Dişler, diş etleri, yumuşak dokular ve kapanış incelenir.",
      },
      {
        title: "Görüntüleme",
        text: "İhtiyaca göre periapikal, bite-wing ya da panoramik röntgen alınır.",
      },
      {
        title: "Tedavi planı",
        text: "Bulgular anlatılır, alternatifleriyle birlikte plan sunulur.",
      },
    ],
    facts: [
      { label: "Muayene", value: "15–20 dk" },
      { label: "Panoramik", value: "Yaklaşık 1 dk" },
      { label: "Teknoloji", value: "Dijital, düşük doz" },
      { label: "Sonuç", value: "Aynı randevuda değerlendirilir" },
    ],
    faq: [
      {
        q: "Hamilelikte röntgen çekilebilir mi?",
        a: "Zorunlu olmadıkça özellikle ilk üç ayda ertelenir. Gerekli durumlarda kurşun önlük ve tiroid koruyucu ile en düşük dozda çekim yapılabilir; hekiminizi mutlaka bilgilendirin.",
      },
    ],
  },
];

export function getTreatment(slug: string) {
  return treatments.find((t) => t.slug === slug);
}

export const featuredTreatments = treatments.filter((t) => t.featured);
