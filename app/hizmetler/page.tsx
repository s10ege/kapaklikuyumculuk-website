import type { Metadata } from "next";

import { Breadcrumb } from "@/components/Breadcrumb";
import { ContactBand } from "@/components/ContactBand";
import { pageTitle } from "@/lib/content";

/* §6.5 — Hizmetler.
 *
 * Two long-form panels. The copy angle for Altın Alım–Satım comes straight
 * from the spec: the two things a customer actually worries about are the rate
 * and the weighing, so both are addressed in the first two sentences rather
 * than buried under reassurance.
 */

export const metadata: Metadata = {
  title: pageTitle("Hizmetlerimiz"),
  description:
    "Altın alım–satımı ve sipariş üzerine üretim. Tartım tezgâh üstünde, " +
    "düşülecek pay işlem öncesinde açıklanır. Kapaklı / Tekirdağ.",
  alternates: { canonical: "/hizmetler" },
};

type Service = {
  slug: string;
  name: string;
  lede: string;
  body: string;
  points: string[];
};

const SERVICES: Service[] = [
  {
    slug: "altin-alim-satim",
    name: "Altın Alım–Satım",
    lede: "Kur ve tartı — iki soru, iki açık cevap.",
    body:
      "Altın bozdururken müşterinin aklındaki iki soru bellidir: bugünkü kur " +
      "ne, ve tartı doğru mu. İkisini de açıkta yapıyoruz. Getirdiğiniz altın " +
      "tezgâhın üstünde, sizin gözünüzün önünde tartılır; ayarı belirlenir ve " +
      "o günkü kura göre karşılığı birlikte hesaplanır. İşçilik ya da kayıp " +
      "payı düşülecekse, işlem yapılmadan önce söylenir.",
    points: [
      "Tartım tezgâhın üstünde, sizin gözünüzün önünde yapılır.",
      "Ayar tayini ve hesap adım adım anlatılır; istediğiniz kadar sorun.",
      "Düşülecek pay varsa işlemden önce söylenir — sonradan sürpriz olmaz.",
      "Hurda altın, bilezik, künye ve set alımı yapılır.",
    ],
  },
  {
    slug: "siparis-uzerine-uretim",
    name: "Sipariş Üzerine Üretim",
    lede: "Vitrinde olmayan bir modeli ürettirebilirsiniz.",
    body:
      "Aklınızdaki parçayı çizerek, bir fotoğrafla ya da yalnızca tarif " +
      "ederek getirin; ölçüyü, ayarı ve gramajı birlikte netleştirelim. Eski " +
      "altınlarınızı bozdurup yeni bir parçaya dönüştürmek de mümkün — " +
      "çoğu zaman en uygun yol bu oluyor. Süre modelin işçiliğine göre " +
      "değiştiği için teslim tarihini en baştan konuşuruz.",
    points: [
      "Çizim, fotoğraf ya da sözlü tarif; hepsi başlangıç noktası olabilir.",
      "Ayar, gramaj ve taş seçimi üretime başlamadan netleştirilir.",
      "Teslim tarihi baştan konuşulur, üretim boyunca haber verilir.",
      "Eski altınlarınız yeni parçanın hesabına sayılabilir.",
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <Breadcrumb
        trail={[{ label: "Anasayfa", href: "/" }, { label: "Hizmetler" }]}
      />

      <section>
        <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
          <p className="text-label uppercase text-gold-soft">Hizmetler</p>
          <h1 className="mt-3 display-md">Ne yapıyoruz</h1>
          <div className="mt-5 h-px w-11 bg-gold" />
          <p className="mt-6 max-w-2xl leading-relaxed text-muted">
            Vitrin dışında iki iş yapıyoruz, ve ikisi de güvene dayanıyor.
            Nasıl çalıştığımızı baştan yazdık ki mağazaya gelmeden ne
            olacağını bilin.
          </p>

          <div className="mt-12 flex flex-col gap-12">
            {SERVICES.map((service) => (
              <article
                key={service.slug}
                id={service.slug}
                className="border-t border-line-dark pt-10"
              >
                <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
                  <div>
                    <h2 className="display-sm">{service.name}</h2>
                    <div className="mt-5 h-px w-11 bg-gold" />
                    {/* Jost — D8 keeps Bodoni ≥32px; the lede is 20px. */}
                    <p className="mt-5 text-xl leading-snug text-gold-soft">
                      {service.lede}
                    </p>
                  </div>

                  <div>
                    <p className="leading-relaxed text-muted">
                      {service.body}
                    </p>

                    <ul className="mt-8 border-t border-line-dark">
                      {service.points.map((point) => (
                        <li
                          key={point}
                          className="border-b border-line-dark py-4 text-sm leading-relaxed"
                        >
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ContactBand
        heading="Önce bir sorun, sonra karar verin"
        body="Kur, gramaj ya da süre — aklınıza takılanı telefonla da sorabilirsiniz. Bağlayıcı bir şey değil."
      />
    </>
  );
}
