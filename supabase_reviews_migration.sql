-- RM Bygg & Montage AB — Database migrations
-- ─────────────────────────────────────────────
-- MIGRATION 2: Add geolocation columns to analytics_events
-- Run this in the Supabase SQL editor

alter table analytics_events
  add column if not exists city      text,
  add column if not exists region    text,
  add column if not exists country   text,
  add column if not exists latitude  float8,
  add column if not exists longitude float8;

-- ─────────────────────────────────────────────
-- MIGRATION 1: Reviews table (run first if not done yet)
-- ─────────────────────────────────────────────
-- RM Bygg & Montage AB — Reviews table migration
-- Run this in the Supabase SQL editor: https://supabase.com/dashboard/project/wdmrfcgdcrhbgvknsece/sql

create table if not exists reviews (
  id         uuid        default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  quote      text        not null,
  name       text        not null,
  role       text        default '',
  rating     int         default 5,
  visible    boolean     default true
);

alter table reviews enable row level security;

-- Public site (anon key) can only read visible reviews
create policy "anon_read_visible" on reviews
  for select to anon
  using (visible = true);

-- Logged-in admin can do everything
create policy "auth_full_access" on reviews
  for all to authenticated
  using (true)
  with check (true);

-- Seed the 7 default reviews
insert into reviews (quote, name, role, rating, visible) values
('"The team walked our roof with me before quoting. That alone told me who I was dealing with. Job came in on the day, on the price."',
 'Anna K.', 'Villa owner · Kungsbacka', 5, true),
('"We had three quotes. His was the clearest and the only one that actually explained why. Solar + battery running two months now, numbers match the forecast."',
 'Martin P.', 'Homeowner · Mölndal', 5, true),
('"Eighteen EV stations for our BRF, load-balanced to the main fuse. Start to grid-ready in three weeks. I''d call him first on the next project."',
 'Lars S.', 'Board chair · BRF Göteborg', 5, true),
('"Taket besiktigades ordentligt innan vi fick offerten. Fuktskador hittades och åtgärdades. Inga överraskningar på fakturan."',
 'Karin L.', 'Villaägare · Partille', 5, true),
('"Twelve windows replaced in one week. The quote listed every fitting and the crew tidied up every single day. That''s the standard I expect."',
 'Johan A.', 'Property manager · Göteborg', 5, true),
('"Fasaden ser ut som ny. Ställning, grundfärg, två lager, städning — allt ingick i priset. Inga dolda kostnader."',
 'Sara M.', 'Villaägare · Kungsbacka', 5, true),
('"Solar panels for 40 apartments plus a shared battery. RM Bygg handled the grid connection and all the BRF paperwork. We barely had to lift a finger."',
 'Erik B.', 'BRF chairman · Mölndal', 5, true);
