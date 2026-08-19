import type { SanitySchemaType } from "./types";

/* Not in §11's original two-schema plan. Added for decision 3 in plan.md.
 *
 * The shop's closing time moves between winter and summer. That is a change the
 * owner needs to make twice a year, and it should not require a developer or a
 * deploy — so the hours live here, and lib/content.ts reads them from Sanity in
 * phase two the same way it reads categories.
 *
 * Everything else here is the canonical NAP. It is editable but marked plainly,
 * because docs/index-cleanup-plan.md is emphatic that these exact characters
 * must match the Google Business Profile and every directory listing. Changing
 * the address here without changing it there reintroduces the precise problem
 * this project exists to fix.
 *
 * ⚠️ The Sanity free-tier dataset is PUBLIC (§11). Nothing private goes in it —
 * no supplier pricing, no personal phone numbers, no customer records.
 */
export const siteSettings: SanitySchemaType = {
  name: "siteSettings",
  title: "Mağaza Bilgileri",
  type: "document",
  description:
    "Sitenin her sayfasında görünen bilgiler. Buradaki adres ve telefon, " +
    "Google işletme kaydınızla harfi harfine aynı olmalıdır.",
  fields: [
    {
      name: "opens",
      title: "Açılış saati",
      type: "string",
      initialValue: "09:00",
      description: "Örnek: 09:00",
    },
    {
      name: "closes",
      title: "Kapanış saati",
      type: "string",
      initialValue: "20:00",
      description:
        "Yaz ve kış saatleri farklıysa buradan değiştirebilirsiniz. " +
        "Değişiklik siteye anında yansır.",
    },
    {
      name: "days",
      title: "Açık günler",
      type: "string",
      initialValue: "Pazartesi – Cumartesi",
    },
    {
      name: "closedNote",
      title: "Kapalı gün notu",
      type: "string",
      initialValue: "Pazar kapalı",
    },
    {
      name: "phone",
      title: "Telefon",
      type: "string",
      initialValue: "0282 717 21 31",
      description:
        "⚠️ Google işletme kaydınızdaki numarayla aynı olmalı.",
    },
    {
      name: "whatsapp",
      title: "WhatsApp numarası",
      type: "string",
      description:
        "Doldurulduğunda sitedeki tüm 'Bizi Arayın' düğmeleri " +
        "WhatsApp'a döner ve mesaj, müşterinin baktığı ürünün adıyla " +
        "hazır gelir. Boş bırakılırsa telefon kullanılmaya devam eder.",
    },
    {
      name: "address",
      title: "Adres",
      type: "text",
      rows: 3,
      initialValue: "Cumhuriyet Mah., Pınar Bulvarı No: 56/A\n59510 Kapaklı / Tekirdağ",
      description:
        "⚠️ Noktalama dahil, Google işletme kaydınızla birebir aynı olmalı. " +
        "'Bulvarı' / 'Blv.' gibi farklar bile önemlidir.",
    },
    {
      name: "landmark",
      title: "Tarif",
      type: "string",
      initialValue: "Ziraat Bankası karşısı",
    },
    {
      name: "instagram",
      title: "Instagram kullanıcı adı",
      type: "string",
      initialValue: "kuyumculukkapakli",
      description:
        "⚠️ 'kapaklikuyumculuk' DEĞİL — o hesap Şanlıurfa'daki başka bir " +
        "kuyumcuya ait. Doğrusu: kuyumculukkapakli",
    },
  ],
  preview: {
    select: { title: "phone", subtitle: "address" },
  },
};
