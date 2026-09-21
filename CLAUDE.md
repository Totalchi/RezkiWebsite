# CLAUDE.md

Website + admin dashboard for **RM Bygg & Montage AB**, a construction company in
Gothenburg, Sweden (solar panels, batteries, EV chargers, windows, roofing, exterior
painting). File layout, CSS/JS load order and the completed-projects feature are
documented in `README.md` — read that first. This file covers what the README doesn't:
hosting state, backend wiring, conventions and gotchas.

## Hosting & deploy

- **Vercel** project `rmbygg` (team `totalchi-s-projects`), Git integration: a push to
  `master` auto-deploys. No build step, no `package.json`, no `vercel deploy` needed.
- **Live URL: https://rmbygg.vercel.app.**
- **Custom domain `rmbygg.nu` was detached from the project on 2026-09-21.** The domain
  and its DNS zone are still in the Vercel team account on purpose — the zone holds the
  Resend email records (see below), so do not delete the domain from the account.
  Re-attach with `vercel domains add rmbygg.nu rmbygg --scope totalchi-s-projects` (and
  the same for `www.rmbygg.nu`). Registrar is Loopia; nameservers point to Vercel
  (`ns1/ns2.vercel-dns.com`); manage DNS with `vercel dns ls|add|rm rmbygg.nu`.
- ⚠️ The canonical links in `index.html` / `projects.html`, the `Sitemap:` line in
  `robots.txt` and the `<loc>`s in `sitemap.xml` still point to `rmbygg.nu`, and the
  README's "Deploying" section still says the site deploys to rmbygg.nu. Update all of
  them together if the primary URL changes.
- GitHub Pages is disabled (no workflow, no `gh-pages` branch); `.nojekyll` is a leftover.
- Commits have landed on `origin/master` from elsewhere before — always `git fetch` and
  compare with `origin/master` before assuming local history is current.

## Stack

- Plain HTML + CSS + vanilla JS, classic `<script>` tags, no framework, no bundler.
- Backend: **Supabase** project ref `wdmrfcgdcrhbgvknsece`, loaded via the supabase-js
  CDN. The public anon config is inline in `index.html` as `window.RM_AUTH_CONFIG`.
- Fonts: Cormorant Garamond (display), Outfit (body), JetBrains Mono (mono).
- Design: dark charcoal (`#0D1117`–`#2C3648`) sections, warm off-white (`#F5F3EF`)
  sections, Falurött red accent `#943226` / `#B03C2E`.
- Language: **Swedish is the default**, English via a client-side toggle. All copy goes
  through the `data-i18n` system in `assets/js/app.js` — add both SV and EN strings.
- Hero video is streamed from an external CDN URL (see `index.html`).
  `rezki-house-video.mp4` in the repo root is an untracked local file, not referenced by
  the site.

## Supabase

Tables (all with RLS):

| Table | Anon | Authenticated |
|---|---|---|
| `leads` | no direct INSERT (revoked, see `supabase_leads_captcha_migration.sql`) | SELECT / UPDATE |
| `analytics_events` | INSERT | SELECT |
| `reviews` | SELECT where `visible = true` | all |
| `projects` | SELECT where `visible = true` | all |

Storage bucket `project-photos`: public read, authenticated-only write.

Edge functions (`supabase/functions/`):

- **`submit-lead`** — the only way leads get in: verifies Cloudflare Turnstile + a
  honeypot, then inserts with the service role. Needs `TURNSTILE_SECRET_KEY`.
- **`send-lead-email`** — fired on every `leads` INSERT by the Postgres trigger
  `send_lead_email_on_insert` (uses `pg_net.http_post`, protected by `WEBHOOK_SECRET`).
  Sends via **Resend** from `noreply@rmbygg.nu` to `info@rmbygg.com`. Templates are
  forced to Swedish (`const lang: Lang = "sv"`); restore per-lead language with
  `lead.lang === "en" ? "en" : "sv"`.
- Secrets live only in Supabase function secrets (`RESEND_API_KEY`, `FROM_EMAIL`,
  `NOTIFICATION_EMAIL`, `REPLY_TO`, `TURNSTILE_SECRET_KEY`, `WEBHOOK_SECRET`) — never
  commit them.
- Deploy a function: `npx supabase functions deploy <name> --use-api` (no Docker needed).
- The `supabase_*_migration.sql` files are applied manually (SQL editor, or the
  Management API `POST https://api.supabase.com/v1/projects/wdmrfcgdcrhbgvknsece/database/query`
  with a personal access token). `supabase login` fails in non-interactive shells.
- Resend's DNS records (MX/TXT on `send`, DKIM on `resend._domainkey`, `_dmarc`) are in
  the Vercel DNS zone for `rmbygg.nu`.

## Admin dashboard (`admin.html`)

- Opened by clicking the © in the footer. Tabs: Leads, Reviews, Projects, Analytics.
- **Intentionally one self-contained file** (inline CSS + JS) — don't split it.
- Login is Supabase email/password only. Never add client-side credential fallbacks.
- `noindex, nofollow` meta + `Disallow: /admin.html` in `robots.txt`.

## Conventions & gotchas

- **All `assets/js/*.js` files use CRLF line endings** (the rest of the repo is LF).
  Exact-match edits can silently fail against them — match `\r\n` explicitly.
- Run `node --check <file>` after editing any JS file.
- Bump the `?v=N` cache-bust query on a CSS/JS/image URL in `index.html` and
  `projects.html` whenever you change that file.
- **No `backdrop-filter` anywhere** — it caused iOS Safari touch blocking. Closed
  overlays must be `display: none` (or `pointer-events: none`), never just `opacity: 0`.
- `projects.html` reuses the homepage scripts. Some DOM lookups in them are not
  null-guarded (`#back-top`, `#scroll-progress`, `#compliance-bar`, the nav burger,
  `#lightbox`), so any new page using those scripts must include those elements.
- The homepage project teaser uses `data-limit="8"` on `#layered-stack`; `projects.html`
  omits it and shows every visible project.
- Promo popup starts 25 s *after* cookie acceptance (never before), shown once
  (`localStorage` key `rm_promo_v1`). Cookie bar key: `rm-cookies`, z-index 1001.
- Compress new photos before adding them: max 1600 px, JPEG quality 82, progressive.
- Don't use the owner's personal name in public copy or filenames — use "RM Bygg" /
  "our team".
- Contact details (keep consistent everywhere): `info@rmbygg.com`; phone 0706 607 744 on
  the site, +46 72 214 32 98 for WhatsApp and emails; office hours Mån–Fre 09:00–18:00.
