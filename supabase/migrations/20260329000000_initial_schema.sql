-- LUX HAIR SUITE: INITIAL SCHEMA

-- Products (Hair, Services, Affiliates)
create table if not exists products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  category text not null, -- 'Frontal', 'Ponytail', 'Weave', 'Service'
  price numeric,
  type text check (type in ('In-Stock', 'Affiliate', 'Service')),
  image_url text,
  affiliate_link text,
  description text,
  is_in_stock boolean default true,
  created_at timestamp with time zone default now()
);

-- Leads (Internal)
create table if not exists leads (
  id uuid default uuid_generate_v4() primary key,
  name text,
  whatsapp_number text,
  source text default 'Internal', -- 'Hero', 'Footer', 'Category'
  status text default 'New', -- 'New', 'Contacted'
  timestamp timestamp with time zone default now()
);

-- External Leads (For the Lead Radar)
create table if not exists external_leads (
  id uuid default uuid_generate_v4() primary key,
  platform text, -- 'X', 'Instagram', 'Web Search'
  snippet text,
  original_link text,
  intent_score numeric,
  status text default 'New',
  created_at timestamp with time zone default now()
);

-- Site Metadata (Live CMS)
create table if not exists site_metadata (
  id uuid default uuid_generate_v4() primary key,
  key text unique not null,
  value text,
  updated_at timestamp with time zone default now()
);

-- Initial Content Seeding
insert into site_metadata (key, value) values
('hero_headline', 'Premium Hair Redefined.'),
('hero_description', 'Experience the ultimate in high-performance Frontals, Ponytails, and Weaves.'),
('brand_name', 'Lux Hair Suite'),
('whatsapp_number', '27123456789')
on conflict (key) do nothing;
