import { test } from "node:test";
import assert from "node:assert/strict";

import {
  address,
  addressLines,
  addressOneLine,
  buildContactCta,
  contact,
  contactCta,
  formatTrPhone,
  getCurrentSeason,
  hours,
  instagramUrl,
  phoneAltDisplay,
  phoneDisplay,
  phoneHref,
  shop,
  telHref,
} from "../lib/config.ts";

/* ------------------------------------------------------------------ */
/* Phone formatting — display and dial must never drift apart          */
/* ------------------------------------------------------------------ */

test("formats a Turkish landline", () => {
  assert.equal(formatTrPhone("902827172131"), "0282 717 21 31");
});

test("formats a Turkish mobile with the same rule", () => {
  assert.equal(formatTrPhone("905549157790"), "0554 915 77 90");
});

test("returns unknown shapes untouched rather than inventing a number", () => {
  assert.equal(formatTrPhone("12345"), "12345");
});

test("derived display values match the canonical block in docs/", () => {
  // docs/index-cleanup-plan.md Step 1 fixes these exact characters.
  assert.equal(phoneDisplay, "0282 717 21 31");
  assert.equal(phoneAltDisplay, "0282 717 55 62");
  assert.equal(phoneHref, "tel:+902827172131");
  assert.equal(telHref("90 282 717 21 31"), "tel:+902827172131");
});

test("never emits the former partner's phone numbers", () => {
  // docs/business-facts.md: these belong to a different business and must not
  // appear anywhere on this site.
  const forbidden = ["7178588", "7173987"];
  const emitted = [
    contact.phone.value,
    contact.phoneAlt.value,
    contact.whatsapp.value,
    phoneDisplay.replace(/\s/g, ""),
    phoneAltDisplay.replace(/\s/g, ""),
  ].join(" ");

  for (const number of forbidden) {
    assert.ok(!emitted.includes(number), `leaked ${number}`);
  }
});

/* ------------------------------------------------------------------ */
/* The pending mechanism (§8, §9)                                      */
/* ------------------------------------------------------------------ */

const PHONE_FALLBACK = "tel:+902827172131";

test("falls back to tel: while the WhatsApp number is pending", () => {
  const cta = buildContactCta({
    whatsapp: { value: "905549157790", pending: true },
    phoneHref: PHONE_FALLBACK,
    productName: "22 Ayar Burma Bilezik",
  });

  assert.equal(cta.channel, "phone");
  assert.equal(cta.href, PHONE_FALLBACK);
  assert.equal(cta.label, "Bizi Arayın");
  assert.ok(!cta.href.includes("wa.me"), "must not emit a wa.me link");
});

test("switches every CTA to WhatsApp when the flag flips", () => {
  const cta = buildContactCta({
    whatsapp: { value: "905549157790", pending: false },
    phoneHref: PHONE_FALLBACK,
    productName: "22 Ayar Burma Bilezik",
  });

  assert.equal(cta.channel, "whatsapp");
  assert.equal(cta.label, "WhatsApp'tan Sorun");
  assert.ok(cta.href.startsWith("https://wa.me/905549157790?text="));
});

test("prefills the product name, which is the point of the mechanic", () => {
  const cta = buildContactCta({
    whatsapp: { value: "905549157790", pending: false },
    phoneHref: PHONE_FALLBACK,
    productName: "22 Ayar Burma Bilezik",
  });

  const text = new URL(cta.href).searchParams.get("text");
  assert.equal(
    text,
    "Merhaba, 22 Ayar Burma Bilezik hakkında bilgi almak istiyorum.",
  );
});

test("omitting a product name still produces a usable message", () => {
  const cta = buildContactCta({
    whatsapp: { value: "905549157790", pending: false },
    phoneHref: PHONE_FALLBACK,
  });

  const text = new URL(cta.href).searchParams.get("text");
  assert.equal(text, "Merhaba, bilgi almak istiyorum.");
});

test("Turkish characters survive the round trip into the wa.me link", () => {
  const cta = buildContactCta({
    whatsapp: { value: "905549157790", pending: false },
    phoneHref: PHONE_FALLBACK,
    productName: "Özel Tasarım Yüzük",
  });

  // Encoded on the wire...
  assert.ok(!cta.href.includes("Özel"), "must be percent-encoded in the href");
  // ...and correct once WhatsApp decodes it.
  assert.equal(
    new URL(cta.href).searchParams.get("text"),
    "Merhaba, Özel Tasarım Yüzük hakkında bilgi almak istiyorum.",
  );
});

test("the live config currently routes to the phone", () => {
  // Mirrors today's state. When the family confirms the number and
  // contact.whatsapp.pending flips to false, this expectation flips with it —
  // which is the reminder to re-run the site-wide CTA check in plan.md §16.
  assert.equal(contactCta("Tek Taş Yüzük").channel, "phone");
});

/* ------------------------------------------------------------------ */
/* Facts that must not quietly change                                  */
/* ------------------------------------------------------------------ */

test("uses the correct Instagram handle", () => {
  // @kapaklikuyumculuk matches our domain but is a jeweller in Şanlıurfa.
  assert.equal(instagramUrl, "https://www.instagram.com/kuyumculukkapakli/");
  assert.notEqual(contact.instagram.value, "kapaklikuyumculuk");
});

test("address matches the canonical block character for character", () => {
  assert.equal(address.street, "Cumhuriyet Mah., Pınar Bulvarı No: 56/A");
  assert.equal(addressOneLine.includes("59510 Kapaklı / Tekirdağ"), true);
  assert.deepEqual(addressLines, [
    "Cumhuriyet Mah., Pınar Bulvarı No: 56/A",
    "59510 Kapaklı / Tekirdağ",
  ]);
});

test("uses the post-2012 district and postcode, not Çerkezköy/59500", () => {
  assert.equal(address.locality, "Kapaklı");
  assert.equal(address.region, "Tekirdağ");
  assert.equal(address.postalCode, "59510");
  assert.ok(!addressOneLine.includes("59500"));
});

test("publishes no coordinates, because the sources disagree", () => {
  assert.ok(!("latitude" in address), "coordinates are graded ❌");
  assert.ok(!("geo" in address));
});

test("has no email address, so no page may offer one", () => {
  assert.equal(contact.email.value, null);
});

test("both seasons carry a full set of hours", () => {
  assert.equal(hours.summer.open, "09:00");
  assert.equal(hours.summer.close, "19:00");
  assert.equal(hours.winter.open, "09:00");
  assert.equal(hours.winter.close, "18:00");
  assert.equal(hours.closed, "Pazar kapalı");
  assert.equal(hours.schemaDays.length, 6, "Sunday is closed");
  // Widened: the tuple's literal type would otherwise reject "Sunday" at
  // compile time, which is reassuring but does not prove the runtime value.
  assert.ok(!(hours.schemaDays as readonly string[]).includes("Sunday"));
});

test("the two seasons cover all twelve months, exactly once each", () => {
  /* The gap this guards is silent: a month in neither list falls through to
   * winter by getCurrentSeason's else-branch and nobody notices, and a month
   * in both makes the label a lie. Twelve, once each, is the whole invariant. */
  const covered = [...hours.summer.months, ...hours.winter.months].sort(
    (a, b) => a - b,
  );
  assert.deepEqual(covered, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
});

test("season labels name the months they cover", () => {
  // The label is what a visitor reads without JavaScript, so it has to say
  // which months it means rather than just "Yaz".
  assert.match(hours.summer.label, /Mayıs.*Eylül/);
  assert.match(hours.winter.label, /Ekim.*Nisan/);
});

test("getCurrentSeason switches on the right days, in Istanbul time", () => {
  const on = (iso: string) => getCurrentSeason(new Date(`${iso}T12:00:00Z`));

  assert.equal(on("2026-04-30"), "winter", "April is still winter");
  assert.equal(on("2026-05-01"), "summer", "May opens the summer season");
  assert.equal(on("2026-09-30"), "summer", "September is the last summer month");
  assert.equal(on("2026-10-01"), "winter", "October opens the winter season");
  assert.equal(on("2026-01-15"), "winter");
  assert.equal(on("2026-12-31"), "winter");
});

test("the season is read in the shop's timezone, not the visitor's", () => {
  /* 30 September 22:00 UTC is already 1 October in Istanbul (UTC+3), and a
   * visitor in Los Angeles reading it as local time would still be in
   * mid-September. The shop's hours belong to the shop's clock. */
  assert.equal(
    getCurrentSeason(new Date("2026-09-30T22:00:00Z")),
    "winter",
    "already 1 October in Kapaklı",
  );
  assert.equal(
    getCurrentSeason(new Date("2026-04-30T22:00:00Z")),
    "summer",
    "already 1 May in Kapaklı",
  );
});

test("legal name is kept distinct from the display name", () => {
  assert.equal(shop.name, "Trakya Kapaklı Kuyumculuk");
  assert.ok(shop.legalName.startsWith("Trakya Kapaklı Kuyumculuk Emlak"));
  assert.notEqual(shop.name, shop.legalName);
});
