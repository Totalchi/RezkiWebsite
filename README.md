# RM Bygg & Montage AB — website

Static website (HTML + CSS + vanilla JS, no build step) with a Supabase backend for
leads, reviews and anonymous analytics. Bilingual (Swedish default, English toggle via a
client-side switch on the same URL). Deployed to GitHub Pages.

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
│   │   │                         #   layered stack, back-to-top, active section, counters, spotlight
│   │   ├── interactions.js       # tabs, service chips, gallery filter + lightbox,
│   │   │                         #   mobile nav drawer, reviews marquee
│   │   └── consent.js            # GDPR cookie bar, promo popup, anonymous analytics
│   │
│   └── images/                   # logo, gallery photos, QR codes
│
├── supabase/                     # Supabase Edge Functions (submit-lead = captcha-
│                                 #   verified lead intake, send-lead-email)
├── supabase_reviews_migration.sql
├── supabase_leads_captcha_migration.sql  # revokes anon INSERT on leads (anti-spam)
├── .github/workflows/deploy.yml  # deploys the repo root to the gh-pages branch
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

## Deploying

Hosted on **GitHub Pages**. Pushing to `master` triggers
`.github/workflows/deploy.yml`, which publishes the repo root to the `gh-pages` branch.
So a normal commit + push to `master` deploys the site — no separate deploy command.
