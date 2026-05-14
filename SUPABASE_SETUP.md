# Supabase setup voor RezkiWebsite

Deze React app gebruikt Supabase voor login, database, klantportaal, adminportaal, statistieken en audit logging.

## 1. Maak een Supabase project

Maak een project in Supabase en kopieer:

- Project URL
- Public anon key

Maak lokaal een `.env` bestand op basis van `.env.example`:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

## 2. Database aanmaken

Voer de SQL uit in:

```text
supabase/migrations/001_initial_auth_portal.sql
```

Dit maakt tabellen voor:

- `profiles`
- `leads`
- `appointments`
- `purchases`
- `invoices`
- `warranty_claims`
- `site_events`
- `admin_audit_logs`

Ook worden Row Level Security policies, rollen en audit triggers aangemaakt.

## 3. Admins maken

Laat een admin eerst normaal registreren via de website. Zet daarna in Supabase SQL Editor de rol om:

```sql
update public.profiles
set role = 'admin'
where id = '<user-uuid>';
```

Je kan dit voor meerdere gebruikers doen. Elke admin wijziging aan leads, facturen, afspraken, profielen en garantieclaims wordt gelogd in `admin_audit_logs`.

## 4. Live deployment op GitHub Pages

Voeg in GitHub repository settings deze Actions secrets toe:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

De workflow `.github/workflows/deploy.yml` gebruikt deze tijdens `npm run build`.

## 5. Belangrijk voor productie

Gebruik de public anon key alleen met Row Level Security aan. De migratie schakelt RLS in en beperkt klantdata tot de eigenaar of admins.
