-- RM Bygg & Montage AB — Completed projects ("Gerealiseerde projecten") migration
-- Run this in the Supabase SQL editor: https://supabase.com/dashboard/project/wdmrfcgdcrhbgvknsece/sql
-- Mirrors the reviews migration pattern: anon can read visible rows, authenticated admin has full access.

-- ─────────────────────────────────────────────
-- Table: projects
-- ─────────────────────────────────────────────
create table if not exists projects (
  id          uuid        default gen_random_uuid() primary key,
  created_at  timestamptz default now(),
  title       text        not null,
  category    text        not null default 'solar', -- solar | battery | ev | window | roof | paint
  location    text        default '',
  year        text        default '',
  description text        default '',
  cover_image text        not null,
  images      jsonb       default '[]'::jsonb,       -- extra photo URLs shown in the detail view
  visible     boolean     default true
);

alter table projects enable row level security;

-- Public site (anon key) can only read visible projects
create policy "anon_read_visible_projects" on projects
  for select to anon
  using (visible = true);

-- Logged-in admin can do everything
create policy "auth_full_access_projects" on projects
  for all to authenticated
  using (true)
  with check (true);

-- ─────────────────────────────────────────────
-- Storage bucket: project-photos (public read, admin-only write)
-- ─────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('project-photos', 'project-photos', true)
on conflict (id) do nothing;

create policy "public_read_project_photos" on storage.objects
  for select to public
  using (bucket_id = 'project-photos');

create policy "auth_upload_project_photos" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'project-photos');

create policy "auth_update_project_photos" on storage.objects
  for update to authenticated
  using (bucket_id = 'project-photos');

create policy "auth_delete_project_photos" on storage.objects
  for delete to authenticated
  using (bucket_id = 'project-photos');

-- ─────────────────────────────────────────────
-- Seed: the 8 projects already shown on the live site, so the section
-- keeps looking exactly the same the moment this migration is applied.
-- Edit/replace these later from the admin dashboard's Projects tab.
-- ─────────────────────────────────────────────
insert into projects (title, category, location, year, description, cover_image, images, visible) values
('Solceller på villatak', 'solar', 'Sandviken', '2025',
 'Takanläggning på 9,6 kWp på en villa i Sandviken. Söderorienterat tak, optimerat för maximal årsproduktion. Från platsbesök till nätanslutning på tre veckor.',
 'assets/images/solar-villa.jpg', '[]', true),
('Laddbox 22 kW', 'ev', 'Gävle', '2025',
 'Installation av 22 kW laddbox för privatbostad, med lastbalansering mot husets huvudsäkring.',
 'assets/images/ev-charger.webp', '[]', true),
('Takrenovering', 'roof', 'Hofors', '2024',
 'Fullständigt byte av takpannor och underlagspapp efter en besiktning som avslöjade fuktskador. Klart på schemalagd tid, inga överraskningar på fakturan.',
 'assets/images/roof-renovation.jpg', '[]', true),
('Fasadmålning i Falurött', 'paint', 'Sandviken', '2024',
 'Ställning, grundfärg, två strykningar och full städning ingick i offerten — inga dolda kostnader.',
 'assets/images/facade-painting.jpg', '[]', true),
('Solceller för bostadsrättsförening', 'solar', 'Gävle', '2025',
 'Solcellsanläggning för en bostadsrättsförening i centrala Gävle, inklusive nätanslutning och föreningens pappersarbete.',
 'assets/images/solar-brf.jpg', '[]', true),
('Batterilager 16 kWh', 'battery', 'Söderhamn', '2025',
 'Batterilagring installerad tillsammans med befintlig solcellsanläggning för ökad självförsörjning och effektutjämning.',
 'assets/images/battery-storage.jpg', '[]', true),
('Fönsterbyte', 'window', 'Gävle', '2024',
 'Byte av samtliga fönster i en BRF-fastighet, treglas, med tätning och plåtarbete runt varje karm.',
 'assets/images/window-replacement.jpg', '[]', true),
('Växelriktarbyte', 'solar', 'Sandviken', '2025',
 'Uppgradering till ny växelriktare för en befintlig solcellsanläggning, med full driftsättning och kontroll av produktionsdata.',
 'assets/images/inverter.jpg', '[]', true)
on conflict do nothing;
