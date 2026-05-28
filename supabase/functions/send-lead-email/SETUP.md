# send-lead-email — setup

Edge Function that fires on every new row in `leads` and sends:
1. Confirmation email to the customer (SV or EN based on `lead.lang`)
2. Notification email to RM Bygg with all lead details

## One-time setup

### 1. Resend account
1. Go to https://resend.com, sign up (free tier: 100/day, 3 000/mo)
2. Open **API Keys** → **Create API key** → copy the `re_...` key
3. (Optional, do later) Add your own domain under **Domains** so emails come from `noreply@rmbygg.com` instead of `onboarding@resend.dev`

### 2. Supabase CLI auth + link
From the project root (`RezkiWebsite/`):

```bash
npx supabase login         # opens browser, paste access token
npx supabase link --project-ref wdmrfcgdcrhbgvknsece
```

### 3. Set the function secrets
```bash
npx supabase secrets set \
  RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxx \
  FROM_EMAIL="RM Bygg <onboarding@resend.dev>" \
  NOTIFICATION_EMAIL=info@rmbygg.com
```

Once you have a verified Resend domain, change FROM_EMAIL to use it:
```bash
npx supabase secrets set FROM_EMAIL="RM Bygg <noreply@rmbygg.com>"
```

### 4. Deploy the function
```bash
npx supabase functions deploy send-lead-email --use-api
```
The `--use-api` flag skips Docker and bundles server-side (faster, no local Docker needed).

After deploy you get a URL like:
`https://wdmrfcgdcrhbgvknsece.supabase.co/functions/v1/send-lead-email`

### 5. Database webhook
In the Supabase dashboard:

1. Open **Database → Webhooks → Create a new hook**
2. Settings:
   - **Name:** `send-lead-email`
   - **Table:** `leads`
   - **Events:** ✔ Insert (only)
   - **Type:** Supabase Edge Functions
   - **Edge Function:** `send-lead-email`
   - **HTTP Method:** POST
   - **HTTP Headers:** leave default (Authorization header is auto-added)
3. Click **Create webhook**

## Testing

### Manual test (no real lead needed)
```bash
curl -X POST 'https://wdmrfcgdcrhbgvknsece.supabase.co/functions/v1/send-lead-email' \
  -H 'Content-Type: application/json' \
  -d '{
    "type": "INSERT",
    "table": "leads",
    "record": {
      "type": "quote",
      "lang": "sv",
      "name": "Test Person",
      "email": "your-own-email@example.com",
      "phone": "+46700000000",
      "services": "Solar panels, Batteries",
      "property_type": "Villa",
      "timing": "Within 3 months",
      "notes": "Detta är ett test."
    }
  }'
```

You should receive BOTH:
- A confirmation email at `your-own-email@example.com`
- A notification email at the `NOTIFICATION_EMAIL` you configured

### End-to-end test
Submit a real form on the website with your own email. Within seconds you should see both emails arrive, and the lead in the admin dashboard.

## Logs / debugging
```bash
npx supabase functions logs send-lead-email --tail
```

Or in the dashboard: **Edge Functions → send-lead-email → Logs**.

## Notes
- The function returns 200 even on partial failure (so the webhook doesn't retry endlessly). Check the JSON response and logs for actual delivery status.
- Resend silently rejects messages to addresses on its suppression list — check Resend dashboard if mails seem to disappear.
- Free Resend allows sending FROM `onboarding@resend.dev` but recipients see "via resend.dev" in some clients. For full branding, verify `rmbygg.com` (or `.se`) on Resend.
