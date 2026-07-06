# submit-lead — setup (anti-spam / Turnstile)

Edge Function that is now the **only** way website leads reach the `leads` table:

1. Browser form includes a Cloudflare Turnstile widget (invisible for most humans)
2. This function verifies the Turnstile token **server-side**
3. Only then is the lead inserted (with the service-role key)
4. The existing Database Webhook on `leads` still fires `send-lead-email` as before

Direct inserts with the public anon key — the route the spam bots use — are shut
off by `supabase_leads_captcha_migration.sql`.

> **Test mode warning:** the repo ships with Cloudflare's public TEST keys
> (`1x00000000000000000000AA` in `index.html`, and the function falls back to the
> matching test secret). Test keys ALWAYS pass — they block nothing. Steps 1–2
> below replace them with real keys. Always swap **both** together: a real site
> key with the test secret (or vice versa) makes every submission fail.

## Activation checklist — follow this order (zero downtime)

### 1. Create Turnstile keys (free)
1. Go to https://dash.cloudflare.com → **Turnstile** (free Cloudflare account is enough)
2. **Add site**:
   - Domains: `rmbygg.nu` and `totalchi.github.io` (add `localhost` too if you want to test locally)
   - Widget mode: **Managed** (recommended — invisible for most visitors)
3. Copy the **Site Key** (public) and **Secret Key** (server-side)

### 2. Set the function secret
From the project root:

```bash
npx supabase secrets set TURNSTILE_SECRET_KEY=0x0000000000000000000000000000000000000
```

### 3. Deploy the functions
```bash
npx supabase functions deploy submit-lead --use-api
npx supabase functions deploy send-lead-email --use-api   # hardened version
```

### 4. Put the real site key in the site and deploy it
1. In `index.html`, replace `turnstileSiteKey: "1x00000000000000000000AA"` with your real Site Key
2. Commit + push to `master` (GitHub Pages deploys automatically)

### 5. Shut the old spam route
Run `supabase_leads_captcha_migration.sql` (repo root) in the
[Supabase SQL editor](https://supabase.com/dashboard/project/wdmrfcgdcrhbgvknsece/sql).
Do this only after steps 3–4 are live, otherwise the old site briefly can't save leads.

### 6. (Recommended) Lock down the email webhook too
`send-lead-email` used to be callable by anyone (it could send emails through your
Resend account). The hardened version only accepts webhook-shaped payloads, and can
additionally require a shared secret:

1. Pick a long random string, e.g. run: `openssl rand -hex 32`
2. `npx supabase secrets set WEBHOOK_SECRET=<that string>`
3. Supabase dashboard → **Database → Webhooks → send-lead-email → Edit**:
   add HTTP header `x-webhook-secret` with the same value
4. Redeploy: `npx supabase functions deploy send-lead-email --use-api`

If you skip this, everything still works — the payload-shape check alone already
blocks the lazy abuse.

## Testing

1. Open https://rmbygg.nu, fill in the booking form → the Turnstile widget should
   show a brief check (usually no puzzle) and the success screen should appear.
2. Check the lead arrives in the admin dashboard and both emails are sent.
3. Bot-path check — this must now FAIL with 401/403 (row was previously inserted):

```bash
curl -X POST 'https://wdmrfcgdcrhbgvknsece.supabase.co/rest/v1/leads' \
  -H 'apikey: sb_publishable_sMzUORcQLLcx1vu8RSTa-A_NAxWUVaG' \
  -H 'Authorization: Bearer sb_publishable_sMzUORcQLLcx1vu8RSTa-A_NAxWUVaG' \
  -H 'Content-Type: application/json' \
  -d '{"type":"quote","email":"bot@example.com","name":"Bot"}'
```

4. Function logs if anything misbehaves:

```bash
npx supabase functions logs submit-lead --tail
```

## Extra layers already in place

- **Honeypot**: each form has an invisible `website` field. Bots that fill it get a
  fake success screen; nothing is stored.
- **Time check**: submissions within 3 seconds of page load are treated as bots
  (client-side only, but catches dumb form-fillers).
- **Field whitelist**: the function only accepts known lead columns, each with a
  max length — no oversized or unexpected payloads.
