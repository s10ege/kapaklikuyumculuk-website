# Vercel cutover — putting the real site on the live domain

> Stage 4.1, written 2026-09-09. **Decision: reuse the existing project rather than create a
> second one.** Read the whole thing before starting; the trade this makes is real and is
> stated below.

## What is actually true today

Checked directly against the live domain and the Vercel API on 2026-09-09, because
`FINAL.md`'s order of operations was written before any of it was known:

| Fact | Value |
|---|---|
| Apex `kapaklikuyumculuk.com` | `A` → `216.198.79.1`, **308s to `www`** |
| `www.kapaklikuyumculuk.com` | `CNAME` → `9581cfdad22c100d.vercel-dns-017.com`, serves the holding page, **200** |
| Nameservers | `ns1.natrohost.com`, `ns2.natrohost.com` — **not touched by this runbook** |
| MX | none |
| Serving project | **`holdingscree-kk`** (`prj_Bn8l6GBMwNsXBf1jmvnYvzpn7NGm`) |
| Team | `team_TbOpsqjUq92SctSKcFm1LYD9` — Hobby |
| Currently linked repo | `s10ege/holdingscree_kk` — **not this one** |
| Framework preset | `null` — it is a static holding page |
| Node | 24.x |

**This is not a DNS job, and it is no longer a domain move either.** DNS already points at
Vercel and stays exactly as it is. The domains stay attached to the project they are already
on. All that changes is **which repository that project builds from**.

## What reusing the project buys, and what it costs

**Buys — the largest risk in this stage disappears.** The apex→www redirect is a Vercel
*domain setting*, not code. Moving domains between projects means re-creating it by hand, and
forgetting it would leave the apex serving the site directly: two canonical hosts, identical
content, which is the duplicate-entity problem this project exists to fix, self-inflicted on
launch day. **The domains never move, so that redirect is never at risk.**

**Costs — there is no "verify on a URL before it is live" window.** With a second project the
site could be inspected on a preview while the domain still pointed elsewhere. Here the
project already owns the domain, so the first production build from this repo *is* the
launch. The safety net moves from "verify before" to "roll back in seconds after", which is
covered below and is genuinely fast — but it is a different shape of safety and worth knowing
you are choosing it.

The preview step is preserved as far as it can be: connect the repo, verify a **branch**
preview, and only then let `main` build.

## Step 1 — point the project at this repo

Vercel dashboard → **`holdingscree-kk`** → Settings:

1. **Git** → disconnect `s10ege/holdingscree_kk` → connect **`s10ege/kapaklikuyumculuk-website`**.
   Production branch: `main`.
2. **Build & Development Settings** → Framework Preset: **Next.js**. It is `null` today
   because the project has only ever served static HTML. Getting this wrong produces a build
   that succeeds and serves nothing useful.
3. **Analytics** → enable **Web Analytics**. Without it `/telefon` and `/yol-tarifi` count
   nothing, and those two pages exist only to be counted.
4. **Deployment Protection** → **Protection Bypass for Automation** → create a secret. Put it
   in a gitignored `.env.local` as `E2E_BYPASS_SECRET=…` so the suite can reach a protected
   preview.

> ⚠ **Watch whether connecting triggers a build.** Vercel normally deploys on the next push
> rather than on connect. If it does deploy `main` immediately, the site goes live at that
> moment and you are past step 2 whether you meant to be — go straight to step 3, and keep
> the rollback in step 5 to hand.

## Step 2 — verify on a branch preview, before `main` goes live

Push the working branch. Vercel builds it as a **preview**, and because the host rule is
gated on `VERCEL_ENV === "preview"` (`next.config.ts`), a preview serves the site directly
instead of redirecting to the canonical domain. Production keeps the rule.

```bash
E2E_BASE_URL=https://<preview-host> \
E2E_BYPASS_SECRET=<secret> \
  npx playwright test --project=prod
```

⏸ **Open the preview in a browser.** This is the last look before the domain carries it.

## Step 3 — go live

Merge the branch to `main`. Vercel builds `main` as production and the domain serves it —
under two minutes, and nothing about DNS or the domain attachment changes.

## Step 4 — immediately after

```bash
curl -sI https://kapaklikuyumculuk.com/      | head -3   # 308 → https://www...
curl -sI https://www.kapaklikuyumculuk.com/  | head -3   # 200
curl -sI https://www.kapaklikuyumculuk.com/urun/altin-seti | head -3  # 308
```

Then the live suite — `FINAL.md` § Live verification, and 4.2's gate:

```bash
E2E_BASE_URL=https://www.kapaklikuyumculuk.com \
E2E_VERCEL_ALIAS=holdingscree-kk.vercel.app \
  npx playwright test --project=prod tests/redirects.spec.ts
```

The apex→www assertion in that suite is new on 2026-09-09. It should pass without anyone
doing anything, precisely because the domains never moved — but it is asserted rather than
assumed, since nothing else in this repo would notice its loss.

## Step 5 — rollback

The holding page's deployments are still in this project's history and stay promotable.

Vercel dashboard → `holdingscree-kk` → **Deployments** → the last deployment built from
`holdingscree_kk` (production, 2026-09-02) → **⋯ → Instant Rollback / Promote to Production**.

**Back on the holding page in well under a minute.** DNS untouched, domain attachment
untouched, nothing to propagate.

**Do not delete those deployments, and do not delete the `s10ege/holdingscree_kk` repo**,
until the 30-day re-verification at 4.8. They are the rollback. The knowing cost of keeping
the project's alias alive is that `holdingscree-kk.vercel.app` will serve *this* site once
connected — which is fine — while the old holding-page build stays reachable only by
promotion, which is what we want.
