-- LUX HAIR SUITE: RLS FIXES FOR CORE TABLES

-- 1. Products Table
alter table products enable row level security;
create policy "Allow public read access on products" on products for select using (true);
create policy "Allow authenticated CRUD on products" on products for all using (auth.role() = 'authenticated');

-- 2. Leads Table
alter table leads enable row level security;
create policy "Allow public insert on leads" on leads for insert with check (true);
create policy "Allow authenticated CRUD on leads" on leads for all using (auth.role() = 'authenticated');

-- 3. Site Metadata Table
alter table site_metadata enable row level security;
create policy "Allow public read on site_metadata" on site_metadata for select using (true);
create policy "Allow authenticated CRUD on site_metadata" on site_metadata for all using (auth.role() = 'authenticated');

-- 4. External Leads Table
alter table external_leads enable row level security;
create policy "Allow authenticated CRUD on external_leads" on external_leads for all using (auth.role() = 'authenticated');

-- 5. Storage Policies (for 'gallery' bucket)
-- Note: These only work if the bucket exists and is set to public.
-- If the bucket is already public, 'select' might be open, but we need 'insert' for admin.
insert into storage.buckets (id, name, public) values ('gallery', 'gallery', true) on conflict (id) do nothing;

create policy "Allow authenticated uploads to gallery"
on storage.objects for insert
with check (
  bucket_id = 'gallery' AND
  auth.role() = 'authenticated'
);

create policy "Allow public viewing of gallery"
on storage.objects for select
using ( bucket_id = 'gallery' );

create policy "Allow authenticated deletes from gallery"
on storage.objects for delete
using (
  bucket_id = 'gallery' AND
  auth.role() = 'authenticated'
);
