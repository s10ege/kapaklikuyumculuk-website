import type { SanitySchemaType } from "./types";

/* Mirrors the Product type in lib/content.ts.
 *
 * Note what is absent: there is no price field, and there must never be one.
 * Prices track the daily gold rate, which is why this site is a catalogue and
 * not a shop. A price field would go stale the day after it was filled in.
 */
export const product: SanitySchemaType = {
  name: "product",
  title: "Ürün",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Ürün adı",
      type: "string",
      description: "Örnek: 22 Ayar Burma Bilezik",
    },
    {
      name: "category",
      title: "Kategori",
      type: "reference",
      of: [{ type: "category" }],
    },
    {
      name: "images",
      title: "Fotoğraflar",
      type: "array",
      /* Hotspot on every image, per §11. */
      of: [{ type: "image", options: { hotspot: true } }],
      description:
        "İlk fotoğraf listede görünen fotoğraftır. Her fotoğrafta, " +
        "ortada kalmasını istediğiniz noktayı işaretleyebilirsiniz.",
    },
    {
      name: "ayar",
      title: "Ayar",
      type: "string",
      options: {
        list: [
          { title: "14 ayar", value: "14" },
          { title: "18 ayar", value: "18" },
          { title: "22 ayar", value: "22" },
          { title: "24 ayar", value: "24" },
          { title: "Gümüş", value: "gümüş" },
          { title: "Platin", value: "platin" },
        ],
      },
    },
    {
      name: "gram",
      title: "Gramaj",
      type: "number",
      description: "Örnek: 38.5 — sitede '38,5 gr' olarak görünür.",
    },
    {
      name: "note",
      title: "Not",
      type: "string",
      description: "Örnek: Sipariş üzerine üretilir",
    },
    {
      name: "featured",
      title: "Anasayfada öne çıkar",
      type: "boolean",
      initialValue: false,
      description:
        "Anasayfadaki 'Öne Çıkanlar' bölümünde gösterilir. " +
        "Hiçbir ürün seçilmezse bölüm tamamen gizlenir.",
    },
    {
      name: "order",
      title: "Sıra",
      type: "number",
      description: "Küçük sayı önce gösterilir.",
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category.name",
      media: "images.0",
    },
  },
};
