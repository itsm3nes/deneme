import type { Metadata } from "next";
import { PageHero } from "@/components/site/ui";
import { clinic } from "@/lib/clinic";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni ve Gizlilik Politikası",
  description:
    "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni ve çerez politikası.",
  alternates: { canonical: "/kvkk" },
  robots: { index: false, follow: true },
};

const sections = [
  {
    title: "1. Veri sorumlusu",
    body: [
      `6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca kişisel verileriniz, veri sorumlusu sıfatıyla ${clinic.legalName} tarafından aşağıda açıklanan kapsamda işlenmektedir.`,
      `Adres: ${clinic.address.full} · Telefon: ${clinic.phone.display} · E-posta: ${clinic.email}`,
    ],
  },
  {
    title: "2. İşlenen kişisel veriler",
    body: [
      "Site üzerindeki randevu formunu doldurduğunuzda ad-soyad, telefon numarası, isteğe bağlı olarak e-posta adresi, tercih ettiğiniz tedavi başlığı, randevu tarih/saat tercihiniz ve formda ilettiğiniz açıklama işlenir.",
      "Klinik ziyaretinizde ayrıca sağlık verileriniz (anamnez, muayene bulguları, radyolojik görüntüler ve tedavi kayıtları) özel nitelikli kişisel veri olarak işlenir.",
    ],
  },
  {
    title: "3. İşleme amaçları ve hukuki sebep",
    body: [
      "Randevu taleplerinin alınması, teyit edilmesi ve iletişim kurulması; sağlık hizmetinin planlanması ve yürütülmesi; ilgili mevzuat kapsamında saklama ve bildirim yükümlülüklerinin yerine getirilmesi.",
      "Hukuki sebep: KVKK m.5/2-c (sözleşmenin kurulması/ifası), m.5/2-ç (hukuki yükümlülük) ve sağlık verileri bakımından m.6/3 (kamu sağlığının korunması, koruyucu hekimlik, teşhis ve tedavi amacıyla sır saklama yükümlülüğü altındaki kişilerce işlenmesi).",
    ],
  },
  {
    title: "4. Aktarım",
    body: [
      "Kişisel verileriniz, yalnızca mevzuatın gerektirdiği hâllerde yetkili kamu kurum ve kuruluşlarına; hizmetin yürütülmesi için zorunlu olduğu ölçüde laboratuvar ve bilişim altyapısı hizmet sağlayıcılarına aktarılabilir. Ticari amaçla üçüncü kişilerle paylaşılmaz.",
    ],
  },
  {
    title: "5. Saklama süresi",
    body: [
      "Randevu formu kayıtları, talebin sonuçlandırılmasının ardından ilgili mevzuatta öngörülen süreler boyunca; hasta dosyaları ise sağlık mevzuatının öngördüğü asgari saklama süreleri boyunca saklanır. Süre sonunda veriler silinir, yok edilir ya da anonim hâle getirilir.",
    ],
  },
  {
    title: "6. Haklarınız",
    body: [
      "KVKK m.11 uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, eksik/yanlış işlenmiş verilerin düzeltilmesini, silinmesini veya yok edilmesini isteme, işlemenin hukuka aykırılığı hâlinde zararın giderilmesini talep etme haklarına sahipsiniz.",
      `Taleplerinizi ${clinic.email} adresine ya da klinik adresimize yazılı olarak iletebilirsiniz.`,
    ],
  },
  {
    title: "7. Çerezler",
    body: [
      "Bu sitede oturum yönetimi ya da reklam amaçlı çerez kullanılmamaktadır. İletişim sayfasındaki harita, Google Maps üzerinden gömülü olarak yüklenir; bu içerik yüklendiğinde Google kendi çerezlerini yerleştirebilir ve IP adresinizi işleyebilir.",
    ],
  },
  {
    title: "8. Sağlık hizmeti tanıtımı hakkında",
    body: [
      "Bu sitedeki içerikler yalnızca bilgilendirme amaçlıdır; hekim muayenesinin yerini tutmaz, tedavi garantisi ya da sonuç vaadi içermez. Sağlık hizmeti sunucularının tanıtım faaliyetleri, ilgili mevzuat ve Sağlık Bakanlığı düzenlemeleri çerçevesinde yürütülür.",
    ],
  },
];

export default function KvkkPage() {
  return (
    <>
      <PageHero
        eyebrow="Yasal"
        title="KVKK Aydınlatma Metni ve Gizlilik Politikası"
        breadcrumbs={[{ label: "KVKK & Gizlilik" }]}
      />

      <section className="section">
        <div className="container-x max-w-3xl">
          {sections.map((section) => (
            <div key={section.title} className="mt-10">
              <h2 className="text-xl font-extrabold">{section.title}</h2>
              {section.body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-4 text-[0.95rem] leading-[1.85] text-ink-600"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
