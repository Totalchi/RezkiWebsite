create extension if not exists pgcrypto;

create type public.app_role as enum ('customer', 'admin');
create type public.lead_status as enum ('new', 'contacted', 'quoted', 'won', 'lost');
create type public.appointment_status as enum ('requested', 'confirmed', 'completed', 'cancelled');
create type public.invoice_status as enum ('draft', 'sent', 'paid', 'overdue');
create type public.claim_status as enum ('submitted', 'reviewing', 'approved', 'rejected', 'resolved');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role public.app_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.profiles(id) on delete set null,
  name text not null,
  email text,
  phone text,
  service text not null,
  message text,
  status public.lead_status not null default 'new',
  assigned_admin_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  service text not null,
  preferred_date date not null,
  preferred_time text not null,
  address text not null,
  notes text,
  status public.appointment_status not null default 'requested',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  project_name text not null,
  service text not null,
  purchase_date date not null,
  amount numeric(12,2),
  warranty_until date,
  created_at timestamptz not null default now()
);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  purchase_id uuid references public.purchases(id) on delete set null,
  invoice_number text not null unique,
  amount numeric(12,2) not null,
  status public.invoice_status not null default 'sent',
  issued_at date not null default current_date,
  due_at date,
  file_url text,
  created_at timestamptz not null default now()
);

create table public.warranty_claims (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  purchase_id uuid references public.purchases(id) on delete set null,
  invoice_id uuid references public.invoices(id) on delete set null,
  subject text not null,
  description text not null,
  status public.claim_status not null default 'submitted',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.site_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  path text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references public.profiles(id) on delete set null,
  action text not null,
  table_name text not null,
  record_id uuid,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch before update on public.profiles
for each row execute function public.touch_updated_at();
create trigger leads_touch before update on public.leads
for each row execute function public.touch_updated_at();
create trigger appointments_touch before update on public.appointments
for each row execute function public.touch_updated_at();
create trigger warranty_claims_touch before update on public.warranty_claims
for each row execute function public.touch_updated_at();

create or replace function public.audit_admin_changes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_admin() then
    insert into public.admin_audit_logs (
      admin_id,
      action,
      table_name,
      record_id,
      before_data,
      after_data
    )
    values (
      auth.uid(),
      tg_op,
      tg_table_name,
      coalesce(new.id, old.id),
      case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) else null end,
      case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) else null end
    );
  end if;
  return coalesce(new, old);
end;
$$;

create trigger audit_leads after insert or update or delete on public.leads
for each row execute function public.audit_admin_changes();
create trigger audit_appointments after update or delete on public.appointments
for each row execute function public.audit_admin_changes();
create trigger audit_invoices after insert or update or delete on public.invoices
for each row execute function public.audit_admin_changes();
create trigger audit_warranty after update or delete on public.warranty_claims
for each row execute function public.audit_admin_changes();
create trigger audit_profiles after update on public.profiles
for each row execute function public.audit_admin_changes();

alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.appointments enable row level security;
alter table public.purchases enable row level security;
alter table public.invoices enable row level security;
alter table public.warranty_claims enable row level security;
alter table public.site_events enable row level security;
alter table public.admin_audit_logs enable row level security;

create policy "Users can read own profile" on public.profiles
for select using (id = auth.uid() or public.is_admin());
create policy "Users can update own basic profile" on public.profiles
for update using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

create policy "Anyone can create leads" on public.leads
for insert with check (true);
create policy "Users can read own leads" on public.leads
for select using (customer_id = auth.uid() or public.is_admin());
create policy "Admins can update leads" on public.leads
for update using (public.is_admin()) with check (public.is_admin());
create policy "Admins can delete leads" on public.leads
for delete using (public.is_admin());

create policy "Users create own appointments" on public.appointments
for insert with check (customer_id = auth.uid());
create policy "Users read own appointments" on public.appointments
for select using (customer_id = auth.uid() or public.is_admin());
create policy "Users update own requested appointments" on public.appointments
for update using (customer_id = auth.uid() or public.is_admin())
with check (customer_id = auth.uid() or public.is_admin());
create policy "Admins delete appointments" on public.appointments
for delete using (public.is_admin());

create policy "Users read own purchases" on public.purchases
for select using (customer_id = auth.uid() or public.is_admin());
create policy "Admins manage purchases" on public.purchases
for all using (public.is_admin()) with check (public.is_admin());

create policy "Users read own invoices" on public.invoices
for select using (customer_id = auth.uid() or public.is_admin());
create policy "Admins manage invoices" on public.invoices
for all using (public.is_admin()) with check (public.is_admin());

create policy "Users create own warranty claims" on public.warranty_claims
for insert with check (customer_id = auth.uid());
create policy "Users read own warranty claims" on public.warranty_claims
for select using (customer_id = auth.uid() or public.is_admin());
create policy "Users update own warranty claims" on public.warranty_claims
for update using (customer_id = auth.uid() or public.is_admin())
with check (customer_id = auth.uid() or public.is_admin());
create policy "Admins delete warranty claims" on public.warranty_claims
for delete using (public.is_admin());

create policy "Anyone can insert site events" on public.site_events
for insert with check (true);
create policy "Admins read site events" on public.site_events
for select using (public.is_admin());

create policy "Admins read audit logs" on public.admin_audit_logs
for select using (public.is_admin());

create index leads_status_created_idx on public.leads(status, created_at desc);
create index appointments_customer_created_idx on public.appointments(customer_id, created_at desc);
create index invoices_customer_created_idx on public.invoices(customer_id, created_at desc);
create index audit_created_idx on public.admin_audit_logs(created_at desc);

-- Maak extra admins mogelijk door de rol aan te passen:
-- update public.profiles set role = 'admin' where id = '<user-uuid>';
