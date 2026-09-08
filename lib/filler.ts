/* Turkish filler copy — stage-1/2 placeholder prose, never Latin lorem ipsum.
 *
 * THE CONTRACT (design.md § Copy, TECHNICAL.md §3): every piece of placeholder
 * body copy on the site lives in this module and nowhere else. The stage-3
 * filler build gate is therefore a one-liner: the production build must not
 * import `lib/filler` — if it does, placeholder copy would ship. Soner's real
 * copy (3.2) replaces these imports at their use sites; the originals they
 * displaced are preserved verbatim in docs/original-copy.md.
 *
 * Every entry deliberately carries the full Turkish glyph set
 * (ı İ ğ ş ç ö ü), so the latin-ext font-fallback checks stay meaningful on
 * every page (hard rule 6). Sentences are written to read plausible on a
 * jeweller's site rather than as visible scaffolding — placeholder is a state,
 * not an aesthetic.
 *
 * NOT in this module, by decision: the load-bearing trust lines that survive
 * the swap (the 2000 founding claim and the weighing promise — asserted by
 * e2e), UI microcopy (buttons, labels, empty-state and CTA-band mechanics),
 * and SEO metadata (title/description), which stage 3 rewrites separately.
 */

export const FILLER = {
  /* Homepage hero lede (one line under the H1). */
  heroLede:
    "Vitrindeki her parça özenle seçilir; ölçüsü, ayarı ve işçiliği güven " +
    "duygusuyla örtüşür.",

  /* Homepage Hakkımızda — D19: two sentences, then the link. */
  homeAbout:
    "Çeyrek asırdır aynı tezgâhın başında, aynı özenle çalışıyoruz. " +
    "Güvenin ölçüsü bizde gramla değil, yıllarla tartılır; İlçemizde " +
    "kuşaktan kuşağa öneriliyor olmak bunun işaretidir.",

  /* Homepage Hizmetler — D19: two compact panels of one line each. */
  homeServices: {
    "altin-alim-satim":
      "Güncel kura göre, tartısı gözünüzün önünde yapılan dürüst bir işlem.",
    "siparis-uzerine-uretim":
      "Aklınızdaki modeli çizin ya da tarif edin; ölçüsüyle birlikte üretelim.",
  },

  /* /hakkimizda — the paragraphs after the load-bearing opening lines. */
  aboutBody: [
    "Kapıdan giren herkes önce çay içer, sonra vitrine bakar; acele " +
      "ettirmek bizim işimiz değildir. Sorulara üşenmeden, ölçüye özen " +
      "göstererek cevap veririz.",
    "İşçiliğine güvenmediğimiz hiçbir parçayı vitrine koymayız. Gözden " +
      "geçirilmemiş takı, çekmecede bekler; müşteriye çıkmaz.",
  ],

  /* /hizmetler — ledes and the non-load-bearing body/points. */
  services: {
    "altin-alim-satim": {
      lede: "İki soruya iki açık cevap: kur ve tartı.",
      /* The weighing promise itself is load-bearing and stays REAL at the
       * use site — this body only carries the surrounding prose. */
      body:
        "Altın bozdurmak güven işidir; süreci başından sonuna açık " +
        "yürütürüz. Getirdiğiniz parçanın ayarı belirlenir, o günkü kur " +
        "birlikte okunur; işlemin hiçbir adımı kapalı kapı ardında değildir. " +
        "Ölçü, çekince ve öneri açıkça konuşulur.",
      points: [
        "Ayar tayini ve hesap adım adım anlatılır; istediğiniz kadar sorun.",
        "Hurda altın, bilezik, künye ve set alımı yapılır.",
      ],
    },
    "siparis-uzerine-uretim": {
      lede: "Vitrinde olmayan model, ölçünüzle üretilir.",
      body:
        "Aklınızdaki parçayı çizerek, fotoğrafla ya da yalnızca tarif ederek " +
        "getirin; ölçüyü, ayarı ve gramajı birlikte netleştirelim. Eski " +
        "altınlarınızı bozdurup yeni bir parçaya dönüştürmek çoğu zaman en " +
        "uygun yoldur. Süre işçiliğe göre değişir; teslim tarihi baştan " +
        "konuşulur.",
      points: [
        "Çizim, fotoğraf ya da sözlü tarif; hepsi başlangıç noktası olabilir.",
        "Ayar, gramaj ve taş seçimi üretime başlamadan netleştirilir.",
        "Teslim tarihi baştan konuşulur, üretim boyunca haber verilir.",
        "Eski altınlarınız yeni parçanın hesabına sayılabilir.",
      ],
    },
  },

  /* Category intros — each mentions Kapaklı or Tekirdağ exactly once
   * (category.spec asserts the mention; the real intros carried the same
   * rule for local search intent). */
  categoryIntro: {
    "altin-seti":
      "Düğünün, nişanın ve özel günlerin başköşesinde altın seti oturur. " +
      "Bilezik, kolye, küpe ve yüzüğü uyumlu bir bütün hâlinde, gramajıyla " +
      "ölçüsüyle birlikte Tekirdağ'daki tezgâhımızda seçiyoruz.",
    "kupe-modelleri":
      "Günlük sade halkadan özel günün gösterişli sallantısına, çocuk " +
      "küpesinden inceliğiyle öne çıkan modellere kadar geniş bir yelpaze " +
      "sunuyoruz. Kulağınıza uygun olanı Kapaklı'daki mağazamızda deneyerek " +
      "seçebilirsiniz.",
    yuzuk:
      "Yüzük çoğu zaman bir söz verilirken alınır; montürün yüksekliği ve " +
      "tırnak işçiliği görünümü baştan değiştirir. Sarı ve beyaz altın " +
      "seçeneklerini Kapaklı'daki vitrinimizde yan yana görüp gönlünüze göre " +
      "seçin.",
    "ozel-tasarim-takilar":
      "Kimi takı çizimle başlar, kimi bir fotoğrafla; kimi de yalnızca " +
      "tarifle. Ölçüsünü, ayarını ve gramajını birlikte netleştirir, " +
      "Tekirdağ'daki atölye ağımızla üretime veririz; teslim gününü baştan " +
      "konuşuruz.",
  },
} as const;
