# Securing the Domain — Action Plan

Goal: get to a state where **nobody can take this domain away from you, and it
cannot lapse by accident**, before any design work starts.

Current state is summarised in `domain-facts.md`. Short version: the registration
is healthy and transfer-locked, but the account hardening is unverified and the
old hosting may be on a deletion clock.

Do these in order. Steps are grouped by urgency, not by topic.

---

## ⏳ Phase 0 — Recover the old hosting files (do this first, this week)

Not strictly "security", but it's the only item with a hard deadline. Everything
else can wait a week; this can't.

1. **Log into the Natro panel and find the hosting package.** Is there one? What's
   its status — active, suspended ("durduruldu"), or gone?
2. **Find its expiry date.** Then count business days:
   - Lapsed **< 3 weeks ago** → files almost certainly still there. Renew or reactivate
     immediately, even for one month. Cheapest insurance you'll ever buy.
   - Lapsed **3–6 weeks ago** → suspended, probably still recoverable. Move today.
   - Lapsed **> 6 weeks ago** → contractually deleted. Open a support ticket anyway
     (0212 213 1 213, 7/24) and ask directly whether any backup snapshot survives.
     Sometimes one does. Don't assume.
3. **If you get access, pull everything down before touching anything else:**
   - Full FTP/File Manager download of the web root (`public_html` or similar)
   - The MySQL database export (WordPress content, page text, media metadata)
   - Specifically hunt for `wp-content/uploads/` — **that's where the product
     photos live**, organised in year/month folders
4. **Store two copies**, one local and one in cloud storage. Then you never have to
   think about Natro's retention policy again.
5. Only after the files are safe: decide whether to keep paying for that hosting.
   (You won't need it — the new site will be hosted elsewhere.)

> The photos are the point here. Page text was already recovered from search
> indexes (see `old-site-map.md`); images were not, and can't be.

## 🔒 Phase 1 — Lock down the account (this week)

The domain is only as secure as the Natro account that controls it. An attacker
doesn't need to break ICANN's transfer process — they just need your password.

6. **Enable 2FA ("Şifrematik") on the Natro account.**
   Müşteri Hesabı İşlemleri → İki Adımlı Doğrulama. TOTP via Google Authenticator
   or Microsoft Authenticator. No SMS option, which is fine — SMS 2FA is the weak
   kind anyway.
   **Save the recovery codes somewhere offline.**
7. **Set a unique, long password** on the Natro account. Not one you use anywhere
   else. Put it in a password manager, not a notebook or a WhatsApp message to
   yourself.
8. **Check which email address the account is registered to.** This is the single
   most important field in the whole system — whoever controls that mailbox can
   reset the password and take the domain.
   - It must be an address **you** control and that **won't lapse**.
   - It must **not** be an `@kapaklikuyumculuk.com` address (those are dead anyway —
     no MX records — and self-referential recovery is a classic lockout trap).
   - That mailbox needs its own strong password and 2FA.
9. **Verify the mobile number on the account** ("Onaylı GSM numarası") and make sure
   it's a phone the family actually still uses.
10. **Confirm the TC kimlik numarası on file is correct.** Natro requires it to
    release an EPP/transfer code — it's an extra layer protecting you, but only if
    the number on file is right and known to you.

## 🔁 Phase 2 — Make it impossible to lose by accident (this week)

11. **Turn on auto-renewal.** Hesabım → Hesap İşlemlerim → Otomatik Yenileme Merkezi.
    Requires a saved card. Must be set **at least 4 days before expiry** to apply.
12. **Understand the auto-renew failure mode — it's nastier than it looks.** Natro
    charges 3 days before expiry (40 days early for some domain products). On
    failure it retries once a day for 3 days, then **cancels the instruction for
    the entire service period** and hands responsibility back to you silently.
    A single expired card can therefore kill auto-renew for a whole year.
    → **Mitigation:** use a card that won't expire before July 2027, and set your
    own calendar reminder anyway (see below).
13. **Set three calendar reminders**, independent of Natro:
    - **19 May 2027** (60 days before expiry) — verify auto-renew is armed and the card is valid
    - **19 June 2027** (30 days) — confirm renewal went through
    - **19 July 2027** — expiry date itself
14. **Renew for multiple years.** Since cost is no longer an issue at ~$30, push the
    expiry out 3–5 years. Fewer renewal events = fewer chances to lose it. It's also
    a mild positive trust signal.

## 🛡️ Phase 3 — Registry-level hardening (next week)

15. **Request `clientDeleteProhibited` and `clientUpdateProhibited`** from Natro
    support. These aren't self-service — you'll need a ticket. They prevent
    deletion and unauthorised nameserver/contact changes at the registry level,
    above the account layer. `clientTransferProhibited` is already on; keep it on.
16. **Consider DNSSEC.** Currently unsigned. It protects against DNS spoofing.
    Moderate value for a local retail site, and it adds a way to break your own
    site if mismanaged — reasonable to defer until after launch, or skip if you're
    moving DNS to Cloudflare (which makes it a one-click affair).
17. **Decide where DNS should live.** Right now it's at Natro. Moving DNS to
    Cloudflare (free) is independent of where the domain is registered and gives
    you faster propagation, a cleaner interface, easy DNSSEC, and analytics.
    **This is safe to do now specifically because there's no email on the domain** —
    the usual risk of a DNS move (silently breaking MX) doesn't apply here.

## 📄 Phase 4 — Ownership hygiene (before launch)

18. **Write down where everything lives** and put it with the family's business
    records: registrar (Nics Telekom via Natro reseller), account email, who has
    access, expiry date, escalation path (abuse@nicproxy.com).
19. **Make sure at least two people in the family can get in.** A domain controlled
    by exactly one person's personal email is one lost phone away from a very bad
    month. Shared password manager vault is the clean answer.
20. **Register a proper business email** once DNS is settled — `info@kapaklikuyumculuk.com`
    via Google Workspace or Zoho. Needed for the Google Business Profile, the
    website contact form, and looking like a real business to customers.
    Do **not** make it the domain's recovery address.

---

## What NOT to do

- **Don't retry the registrar transfer right now.** The 27 July attempt failed for a
  real reason: the domain had just been renewed, and transferring inside the **45-day
  post-renewal window** risks losing the year you already paid for. ICANN's separate
  **60-day lock** also applies after registration, a prior transfer, or any change to
  the registrant name/organisation/email — and no registrar can override it.
  At ~$30/year there's no financial case anyway. If you still want to move later, the
  clean window is **2–3 months before the July 2027 expiry**, and the sequence is:
  restore DNS first → confirm the site is stable → then transfer.
- **Don't let the domain expire "to see what happens."** Dropped domains with 13
  years of history and existing search presence get picked up by speculators fast.
- **Don't point DNS anywhere until the new site is ready** — except optionally a
  simple holding page, which is genuinely worth doing (see the index cleanup plan).

## Open items needing a human

- [ ] Was the 27 July zone change deliberate, or did hosting lapse?
- [ ] Does a Natro hosting package still exist, and what's its status?
- [ ] Is 2FA already on the account?
- [ ] Is auto-renew already armed, and on which card?
- [ ] Which email address is the Natro account registered to?
- [ ] Did anyone ever use an `@kapaklikuyumculuk.com` mailbox?
