# RM Bygg & Montage AB — website

Static website (HTML + CSS + vanilla JS, no build step) with a Supabase backend for
leads, reviews, completed projects and anonymous analytics. Bilingual (Swedish default,
English toggle via a client-side switch on the same URL). Deployed to Vercel.

## Project structure

```
RezkiWebsite/
├── index.html                   # public website
├── admin.html                   # admin dashboard (hidden via footer ©) — single self-contained file
│
├── assets/
│   ├── css/
│   │   ├── variables.css         # :root design tokens (colours, type, spacing)
│   │   ├── base.css              # layout atoms, nav, hero, buttons, marquee, section scaffolding
│   │   ├── components.css        # services, promise, process, layered stack, gallery,
│   │   │                         #   testimonials, contact, footer, lightbox, auth modal
│   │   └── utilities.css         # reveal/animations, responsive overrides, whatsapp, scroll
│   │                             #   progress, mobile nav, promo popup, cookie bar, helpers
│   │
│   ├── js/
│   │   ├── app.js                # core: i18n (language switch) + booking calendar +
│   │   │                         #   contact form + admin login modal
│   │   ├── ui.js                 # UI & scroll effects: nav scroll, reveal, hero video,
│   │   │                         #   layered stack (window.initLayeredStack, re-run after
│   │   │                         #   interactions.js swaps in Supabase project cards),
│   │   │                         #   back-to-top, active section, counters, spotlight
│   │   ├── interactions.js       # tabs, service chips, gallery filter + lightbox,
│   │   │                         #   mobile nav drawer, reviews marquee, completed-projects fetch
│   │   └── consent.js            # GDPR cookie bar, promo popup, anonymous analytics
│   │
│   └── images/                   # logo, gallery photos, QR codes (also the static fallback
│                                  #   cover images seeded into the `projects` table)
│
├── supabase/                     # Supabase Edge Functions (submit-lead = captcha-
│                                 #   verified lead intake, send-lead-email)
├── supabase_reviews_migration.sql
├── supabase_leads_captcha_migration.sql  # revokes anon INSERT on leads (anti-spam)
├── supabase_projects_migration.sql  # `projects` table + `project-photos` storage bucket
└── README.md                     # this file
```

## CSS load order

`variables.css` → `base.css` → `components.css` → `utilities.css`

The split follows the exact source order of the original `site.css`, so the cascade is
unchanged. Responsive `@media` rules stay co-located with their component rather than in a
separate file, so everything about one component lives in one place.

## JS load order

The supabase CDN script loads first (the modules use `window.supabase`), then:

```
app.js → ui.js → interactions.js → consent.js
```

Each module is a classic script that wraps its own `DOMContentLoaded` handler. Sections
that shared state in the old single file are grouped into the same module (e.g. the
booking calendar/form and the language switch live together in `app.js`; the lightbox and
mobile nav in `interactions.js`; the cookie bar, promo and analytics in `consent.js`), so
behaviour is identical to the original. `app.js` loads before `consent.js` because the
language switch writes `rm-lang` to localStorage, which analytics then reads.

`window.RM_AUTH_CONFIG` (Supabase URL + anon key) is defined inline in `index.html`
before the scripts load.

## Completed projects ("Gerealiseerde projecten")

The "Recent work" section (`#projects` / the layered-stack card gallery) ships with a
static fallback set of 8 cards in `index.html`, but is normally driven by the `projects`
table in Supabase (see `supabase_projects_migration.sql`) so RM Bygg can add real photos
and write-ups from the admin dashboard without a code change:

- **Public site:** `interactions.js` fetches visible rows from `projects`, replaces the
  `.ls-grid` markup, then calls `window.initLayeredStack()` (defined in `ui.js`) to rebind
  the stack/spread/filter/lightbox interaction on the fresh cards. If Supabase has no rows
  or isn't reachable, the static fallback cards already in the HTML are left untouched and
  still work (they carry the same `data-title/-location/-year/-desc/-images` attributes).
  Clicking a spread card opens `#lightbox` as a detail view with the cover photo, any extra
  photos as thumbnails, category tag, location · year, and the description.
- **Admin dashboard:** the *Projects* tab (`admin.html`) is full CRUD, modelled on the
  Reviews tab — title, category, location, year, description, a visibility toggle, plus
  cover + extra photo upload straight to the public `project-photos` Supabase Storage
  bucket (authenticated-only write, public read; see the migration file for the bucket
  policies). Deleting a project best-effort removes its uploaded photos from storage too.

## Deploying

Hosted on **Vercel** (Git-integration). Pushing to `master` auto-deploys to
https://rmbygg.nu — no CLI or separate deploy command needed.
