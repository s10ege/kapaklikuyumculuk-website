/* Every sentence a visitor reads, in one module.
 *
 * This replaced lib/filler.ts on 2026-09-08. That module held Turkish
 * placeholder prose for stages 1 and 2 and existed to be deleted: TECHNICAL.md
 * §3 specified a build gate that would fail if any of it survived to launch.
 * The gate is here now (tests/copy.test.mts) and it does a bigger job than the
 * one it replaced — filler was easy to spot, and the copy that actually
 * threatens this site is the fluent kind that says nothing.
 *
 * THE VOICE — sade esnaf sesi. The shop owner talking across the counter.
 * First person plural, the customer addressed as "siz". Short sentences, one
 * idea each. Concrete over evocative: say what happens in the shop.
 *
 * The test enforces what can be enforced — a banned-word list, no exclamation
 * marks, sentence-count caps, the locality named exactly once per page. What
 * it cannot check is the thing that matters: whether a sentence tells the
 * reader something they did not know. Every line below should answer a
 * question a customer actually asks at the counter — what ayar is it, what
 * does it weigh, why is there no price, will you weigh it in front of me,
 * what gets deducted, can you resize it, how long does an order take.
 *
 * BUSINESS FACTS ARE NOT COPY. Nothing here spells out an address, a phone
 * number or an opening time; those live in lib/config.ts and are composed in.
 * The founding year is imported for the same reason.
 *
 * SAFE FOR CLIENT COMPONENTS. This module imports lib/config.ts and nothing
 * else — in particular never lib/content.ts, which walks the filesystem. The
 * lightbox is a "use client" component and imports the price note from here.
 */

import { shop } from "./config.ts";

/* Five lines below name a contact channel, and until 2026-09-08 each carried
 * two versions — one saying "WhatsApp'tan yazın", one saying "telefonla
 * sorun" — chosen by contact.whatsapp.pending, so the copy could never
 * contradict the buttons. WhatsApp was removed; the phone versions are simply
 * the copy now. Nothing was rewritten in the collapse.
 */

export const COPY = {
  /* ---------------------------------------------------------------- */
  /* Anasayfa                                                          */
  /* ---------------------------------------------------------------- */

  home: {
    /* One line under the H1. It names the three things the shop does and the
     * two things people are nervous about, and stops. */
    heroLede:
      "Kapaklı'da altın alır, satar, sipariş üzerine yaparız. Ayar ve gram " +
      "etikette yazar, tartı tezgâhın üstünde önünüzde yapılır.",

    /* D19 — two sentences and the link; the argument itself is on
     * /hakkimizda. The locality is deliberately absent: the hero above has
     * already named it once, and once per page is the rule. */
    about:
      `Dükkânı ${shop.founded} yılında açtık ve o gün bugündür aynı ` +
      "adresteyiz. Aldığınız takıyı yıllar sonra ölçüye ya da tamire " +
      "getirdiğinizde aynı tezgâhı bulursunuz.",

    /* D19 — one line per service panel. The full version is on /hizmetler. */
    services: {
      "altin-alim-satim":
        "Getirdiğiniz altın tezgâhta, gözünüzün önünde tartılır. Kur o günkü " +
        "kurdur, hesabı birlikte yaparız.",
      "siparis-uzerine-uretim":
        "Aklınızdaki modeli çizin, anlatın ya da fotoğrafını gönderin. Ölçüyü " +
        "ve gramı konuşur, teslim gününü baştan söyleriz.",
    },

    contactLede:
      "Aradığınız modeli telefonla sorun ya da uğrayın. Vitrinde olmayanı da " +
      "çoğu zaman tedarik ediyoruz.",
  },

  /* ---------------------------------------------------------------- */
  /* Kategori girişleri                                                */
  /* ---------------------------------------------------------------- */

  /* With no product pages, each of these is its own category's entire search
   * surface — what Google reads, and what someone arriving from Instagram
   * reads too. Each names Kapaklı or Tekirdağ exactly once, where it belongs
   * in the sentence rather than bolted on the end. */
  categoryIntro: {
    "altin-seti":
      "Set dediğimiz, birlikte takılsın diye seçilmiş kolye, bilezik, küpe " +
      "ve yüzüktür. Çeyiz ve nişan için en çok bunlar soruluyor; her " +
      "parçanın ayarı ve gramı etiketinde yazar. Kapaklı'daki dükkânda " +
      "hepsini elinize alıp deneyebilirsiniz.",

    "kupe-modelleri":
      "Halka, sallantılı, mineli, taşlı; günlük takılanı da var, düğüne " +
      "takılanı da. Çocuk küpesi ve vidalı modeller de bulunur. " +
      "Beğendiğinizi Tekirdağ'daki dükkânımızda deneyip aynada " +
      "bakabilirsiniz.",

    yuzuk:
      "Yüzüklerimiz 14 ve 22 ayar. Beyaz altın modeller de bu sayfada; " +
      "taşlısını ve düzünü yan yana görebilirsiniz. Ölçünüz yoksa " +
      "Kapaklı'daki dükkânda beş dakikada bakarız, ölçü ayarı bizde yapılır.",

    "ozel-tasarim-takilar":
      "Vitrinde olmayan bir model istiyorsanız çizin, anlatın ya da " +
      "fotoğrafını gönderin. Ayarı, gramı ve taşı üretime girmeden birlikte " +
      "netleştiririz. İşçiliğe göre değişir; çoğu parça iki ile dört hafta " +
      "arasında Tekirdağ'daki atölyelerden gelir.",
  },

  /* ---------------------------------------------------------------- */
  /* Sayfa metinleri                                                   */
  /* ---------------------------------------------------------------- */

  urunler: {
    lede:
      "Dört başlıkta topladık: altın set, küpe, yüzük ve sipariş üzerine " +
      "yaptığımız takılar. Kapaklı'daki vitrinimizde gördüğünüzden fazlası " +
      "var; aradığınız burada yoksa sorun.",
  },

  galeri: {
    lede:
      "Dört kategoriden seçtiğimiz parçalar burada bir arada. Fotoğraflar " +
      "Kapaklı'daki vitrinimizden; hepsi her gün dükkânda olmayabilir, " +
      "sorarsanız bakarız.",
  },

  hizmetler: {
    lede:
      "Vitrin dışında iki iş yapıyoruz: altın alıp satmak ve sipariş üzerine " +
      "üretmek. Ölçü ayarı ve tamir de Kapaklı'daki dükkânda, her gün " +
      "yaptığımız işler.",

    /* The two load-bearing trust claims live at the use site in
     * app/hizmetler/page.tsx, not here — they are asserted by e2e and must
     * survive any rewrite of the prose around them. */
    "altin-alim-satim": {
      lede: "Kur o günkü kur, tartı sizin önünüzde.",
      body:
        "Ayarını birlikte bakarız, o günkü kuru birlikte okuruz. Hesabı adım " +
        "adım anlatırız; anlamadığınız yeri tekrar sorun.",
      points: [
        "Hurda altın, bilezik, künye ve set alıyoruz.",
        "Ayar tayinini ve hesabı adım adım anlatırız.",
      ],
    },

    "siparis-uzerine-uretim": {
      lede: "Vitrinde olmayan model, sizin ölçünüzle yapılır.",
      body:
        "Aklınızdaki parçayı çizerek, fotoğrafla ya da anlatarak getirin. " +
        "Ayarı, gramı ve taşı üretime girmeden netleştiririz; eski altınınızı " +
        "bozdurup hesaba saymak çoğu zaman en uygun yol. Süre işçiliğe göre " +
        "değişir, teslim gününü baştan söyleriz.",
      points: [
        "Çizim, fotoğraf ya da sözlü tarif; üçü de başlangıç olabilir.",
        "Ayar, gram ve taş üretime başlamadan netleşir.",
        "Çoğu parça iki ile dört hafta arasında teslim edilir.",
        "Eski altınlarınız yeni parçanın hesabına sayılabilir.",
      ],
    },

    contactBand: {
      heading: "Önce sorun, sonra karar verin",
      body:
        "Kur, gram ya da teslim süresi; aklınıza takılanı telefonla " +
        "sorabilirsiniz. Sormak bir şeye bağlamaz.",
    },
  },

  /* Three paragraphs, and the page's whole argument is in the first one: a
   * jeweller sells things that come back. Everything the shop does about
   * ayar, tartı and kesinti follows from that, which is why it leads. */
  hakkimizda: {
    paragraphs: [
      "Kapaklı'da bir aile dükkânıyız. Sattığımız şeyler geri gelir: ölçü " +
        "için, tamir için, bir sonraki kuşağa geçerken. Dükkânı ona göre " +
        "işletiriz; kimseye bugün satıp yarın görüşmeyeceğimiz bir müşteri " +
        "gözüyle bakmayız.",

      `Dükkânı ${shop.founded} yılında açtık; o gün bugündür aynı adreste, ` +
        "aynı ailenin elindeyiz. Vitrindeki her parçanın ayarı ve gramı " +
        "etiketinde yazar. Fiyat yazmaz: fiyat o günkü altın kuruna göre " +
        "değişir, sorduğunuzda o anki hesabı söyleriz.",

      "Altın bozdururken tartı tezgâhın üstünde, sizin önünüzde yapılır. " +
        "Düşülecek pay varsa tartıdan önce söyleriz. Ölçü ayarı, tamir ve " +
        "sipariş üzerine üretim de burada; başka bir yerde gördüğünüz bir " +
        "modeli telefonla anlatın, yapabiliyor muyuz bakalım.",
    ],

    contactBand: {
      heading: "Uğrayın, tanışalım",
      body:
        "Bir şey almak zorunda değilsiniz. Bakmak, sormak, tartıya baktırmak " +
        "serbest.",
    },
  },

  iletisim: {
    lede:
      "Aradığınız modeli önden sorun. Elimizde varsa ayırıp bekletiriz; " +
      "yoksa ne zaman gelebileceğini söyleriz.",
  },

  /* The old WordPress site left 309 URLs behind and Google still crawls some
   * of them, so this page is read by real people who followed a real search
   * result. It says what happened and points at the two things they came for.
   * "Web sitemiz yenilendi" is asserted by e2e — it is the sentence that
   * explains the 404 rather than apologising for it. */
  notFound: {
    body:
      "Web sitemiz yenilendi, bazı eski adresler değişti. Eski bir bağlantıyı " +
      "ya da arama sonucunu takip etmiş olabilirsiniz. Dükkân yerinde; " +
      "aradığınızı aşağıdan bulabilirsiniz.",
  },

  footer: {
    blurb:
      `${shop.founded} yılından beri aynı adreste. Altın alır, satar, ölçü ` +
      "ayarı ve tamir yapar, sipariş üzerine üretiriz.",
  },

  /* ---------------------------------------------------------------- */
  /* Bileşen metinleri                                                 */
  /* ---------------------------------------------------------------- */

  /* Every category has photographs now, so this is only reachable from
   * /dev/grid — and from any category that is added before it is shot. It
   * stays written as an invitation rather than an apology. */
  emptyState: {
    eyebrow: "Yakında",
    headline: (subject: string) =>
      `${subject} fotoğrafları henüz yüklenmedi.`,
    body: "Aradığınız modeli telefonla sorun, vitrinde olanı tarif edelim.",
  },

  contactBand: {
    heading: "Vitrinde olmayanı da bulabiliriz",
    body:
      "Başka bir yerde gördüğünüz bir modeli telefonla anlatın. Tedarik " +
      "edebiliyorsak aynı gün haber veririz.",
  },

  /* Why there is no price. Saying it plainly is more reassuring than leaving
   * a blank where a price would be — and it is the single most common
   * question the shop is asked. */
  lightbox: {
    priceNote:
      "Fiyat günün altın kuruna göre belirlenir; bu yüzden sitede yazmıyor. " +
      "Telefonla sorun, o anki hesabı söyleyelim.",
  },
} as const;
