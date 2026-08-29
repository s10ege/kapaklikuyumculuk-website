<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# Trakya Kapaklı Kuyumculuk — project rules

Read this before writing any code. `plan.md` is the index; the work runs through four
approval-gated stage files: `design.md` → `CATALOGUE.md` → `TECHNICAL.md` → `FINAL.md`.

## Hard rules

1. **Business facts live in `lib/config.ts` and nowhere else.** Name, address, phones,
   hours, Instagram handle. `tests/source-invariants.test.mts` fails the build if any of
   them is inlined elsewhere. Never hardcode a phone number or an address in a component.
2. **The canonical name is `Trakya Kapaklı Kuyumculuk`**, title case, in every stored
   string. Caps are a CSS `text-transform` treatment only — ALL-CAPS risks a Google
   Business Profile name policy violation.
3. **Never request Search Console removal of the `/urunler/` prefix.** It is the live
   catalogue. Removing it hides all five category pages for ~6 months. Only `/urun/`,
   `/wp-content/` and `/author/` are ever removed.
4. **The redirect map in `next.config.ts` is the highest-risk artefact in the repo.** A
   wrong redirect looks exactly like a working site. Any change to that file re-runs
   `tests/redirects.spec.ts`.
5. **No stage begins without Soner's explicit written approval.** `TECHNICAL.md` §1 is a
   ⛔ confirmation gate: stop and ask for the six facts before writing code in stage 3. Do
   not infer them from `docs/`, and do not carry them over from an earlier session.
6. **Turkish filler, never Latin lorem ipsum.** Placeholder copy must carry
   `ı İ ğ ş ç ö ü` so font-fallback checks stay meaningful. Real copy is preserved in
   `docs/original-copy.md`.
7. **Prices are never published.** They track the gold rate.
8. **No contact form.** The domain has no MX records; a test enforces its absence.
9. **The build stays fully static.** No server rendering, no `ƒ` markers in build output.

## Design system

Decisions are numbered D1–D20 in `design.md`. The ones most often violated:

```
ground     #17120E   espresso — page background
panel      #241C15   cards, raised bands
frame      #F4F0E8   cream — header, footer, and the two reading bands
ink-text   #1A1816   text on cream
cream-text #E8E3DA   body text on dark — NEVER pure white (halation)
muted      #9A958D   secondary text on dark
line-dark  #262B31 · line-light #E4DED2
gold       #B8964F · gold-soft #CBAE72 · gold-deep #77602A (gold on cream)
ink-muted  #5F5A52   secondary text on cream
whatsapp   #25D366
```

- Gold is a **hairline accent**. The only permitted fill is a primary button, one per
  section (D12).
- **No shadows.** The single exception is the warm radial glow under the hero coin (D7).
- Radius 0–2px. Grid gaps are 1px of `line` showing through, not margins.
- **Ibarra Real Nova is display-only, ≥32px, weight 500** (D8) — chosen at the 1.6
  review after Bodoni Moda and Marcellus were rejected. Jost carries all body text.
- Never name a token `base` — it collides with `text-base`.

## Agents

Four subagents in `.claude/agents/`. Use them rather than doing this work inline:

- **`visual-qa`** — captures and measures. Screenshots at 390/768/1440, Turkish glyphs,
  contrast, 320px overflow. Reports facts.
- **`design-reviewer`** — judges built pages against D1–D20 and the design skills.
- **`seo-auditor`** — NAP consistency, JSON-LD, metadata, sitemap, OG images.
- **`redirect-verifier`** — the 24 redirect rules and the 200-not-301 assertions.

## Skills

Managed by `skills-lock.json` and updatable: `frontend-design`, `next-dev-loop`,
`vercel-composition-patterns`, `vercel-react-best-practices`, `web-design-guidelines`,
`webapp-testing`.

**Vendored by hand and NOT in the lockfile** — they will never update, and editing them is
the source of most line-ending noise in `git status`: `ui-ux-pro-max` (copied from another
project), `find-skills`.

Project-local and committed: `kk-brand` (this design system, machine-readable),
`catalogue-pipeline` (the photo → polish → publish loop) and `project-setup` (bootstrapping
a clone).

## Setting up a clone

`npm run setup`, or `/setup` in Claude Code. One script — `scripts/setup.mjs` — restores
dependencies, the gitignored third-party skills, Playwright browsers and the working
folders. It pings the registry before running `npm ci`, because `npm ci` deletes
`node_modules` first and a failed offline run would leave the clone unusable. The Cowork
device shell has no network, so setup always has to be run from a normal terminal.
