import type { SanitySchemaType } from "./types";

/* Mirrors the Category type in lib/content.ts. Field labels are Turkish because
 * the people editing this are the shop's owners, not developers. */
export const category: SanitySchemaType = {
  name: "category",
  title: "Kategori",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Kategori adı",
      type: "string",
      description: "Örnek: Pırlanta",
    },
    {
      name: "slug",
      title: "URL adresi",
      type: "slug",
      options: { source: "name", maxLength: 60 },
      /* §4 rule 1 requires this warning to live here, in the editor's face.
       * Two of these slugs are already in Google's index; changing one without
       * adding a redirect first silently discards that history. */
      description:
        "⚠️ DİKKAT: Bu adres yayında olan bir web adresidir. " +
        "Değiştirmeden önce mutlaka geliştiriciye haber verin — eski adresin " +
        "yenisine yönlendirilmesi gerekir, yoksa Google'daki sıralama kaybolur.",
    },
    {
      name: "title",
      title: "Sayfa başlığı (SEO)",
      type: "string",
      description:
        "Tarayıcı sekmesinde ve Google sonuçlarında görünen başlık. " +
        "Boş bırakılırsa kategori adı kullanılır.",
    },
    {
      name: "description",
      title: "Meta açıklama (SEO)",
      type: "text",
      rows: 3,
      description: "Google sonuçlarında başlığın altında görünen 1–2 cümle.",
    },
    {
      name: "intro",
      title: "Giriş paragrafı",
      type: "text",
      rows: 5,
      /* With no product pages, this paragraph is the category's entire search
       * surface (§6.2) — worth saying plainly to whoever edits it. */
      description:
        "Kategori sayfasının en önemli metni. Google bu paragrafı okur, " +
        "müşteri de okur. 2–3 cümle, gerçek bir anlatım olsun; " +
        "'Kapaklı' veya 'Tekirdağ' bir kez doğal biçimde geçsin.",
    },
    {
      name: "coverImage",
      title: "Kapak görseli",
      type: "image",
      /* §11 — hotspot is the deciding feature. The editor drags one dot onto
       * the important part of a photo and every crop on the site (square tile,
       * wide hero, mobile strip) crops around it. With amateur photography of
       * inconsistent framing this is the difference between a tidy grid and a
       * messy one. */
      options: { hotspot: true },
      description:
        "Karonun ortasında kalmasını istediğiniz noktayı seçebilirsiniz.",
    },
    {
      name: "order",
      title: "Sıra",
      type: "number",
      description: "Küçük sayı önce gösterilir.",
    },
  ],
  preview: {
    select: { title: "name", subtitle: "slug.current", media: "coverImage" },
  },
  orderings: [
    {
      title: "Sıraya göre",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
};
