-- RM Bygg & Montage AB — MIGRATION 3: lock down the leads table (anti-spam)
-- ─────────────────────────────────────────────────────────────────────────
-- Run this in the Supabase SQL editor, but ONLY AFTER:
--   1. the submit-lead Edge Function is deployed, and
--   2. the updated site (Turnstile forms) is live.
-- Order matters — see supabase/functions/submit-lead/SETUP.md for the full checklist.
--
-- Why: spam bots don't need the form at all. The anon (publishable) key is public
-- in index.html, so anything on the internet can POST rows straight into `leads`
-- via the REST API. From now on the ONLY write path is the submit-lead Edge
-- Function, which verifies a Cloudflare Turnstile token first and inserts with
-- the service-role key (service role bypasses RLS, so it keeps working).

-- 1. Drop any INSERT policy on leads that lets anon (or everyone) write
do $$
declare p record;
begin
  for p in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename  = 'leads'
      and cmd        = 'INSERT'
      and (roles @> '{anon}'::name[] or roles @> '{public}'::name[])
  loop
    execute format('drop policy %I on public.leads', p.policyname);
  end loop;
end $$;

-- 2. Belt and braces: revoke the table privilege itself from the anon role
revoke insert on table public.leads from anon;

-- The authenticated admin dashboard keeps its read/update access through the
-- existing "Admins only" policy; nothing changes there.
