-- LUX HAIR SUITE: BUSINESS LOGIC (CUSTOMERS, ORDERS, SETTINGS)

-- 1. Customers Table (Detailed Leads & Buyers)
create table if not exists customers (
  id uuid default uuid_generate_v4() primary key,
  full_name text not null,
  email text unique,
  whatsapp_number text unique,
  total_spend numeric default 0,
  last_purchase_at timestamp with time zone,
  notes text,
  created_at timestamp with time zone default now()
);

-- 2. Orders Table (Transaction History)
create table if not exists orders (
  id uuid default uuid_generate_v4() primary key,
  customer_id uuid references customers(id),
  product_id uuid references products(id),
  amount numeric not null,
  status text default 'Pending', -- 'Pending', 'Paid', 'Shipped', 'Completed', 'Cancelled'
  payment_reference text unique,
  payment_method text, -- 'Card', 'Ozow', 'Capitec Pay'
  created_at timestamp with time zone default now()
);

-- 3. Secure Settings Table (API Keys, Config)
-- This table should have strict RLS (only admin can read/write)
create table if not exists app_settings (
  id uuid default uuid_generate_v4() primary key,
  key text unique not null,
  value text,
  is_secret boolean default false,
  updated_at timestamp with time zone default now()
);

-- RLS (Row Level Security) - Basic Setup
alter table customers enable row level security;
alter table orders enable row level security;
alter table app_settings enable row level security;

-- Policies (Admin only for these sensitive tables)
-- Assuming the admin user is authenticated via Supabase Auth
create policy "Admin can do everything on customers" on customers for all using (auth.role() = 'authenticated');
create policy "Admin can do everything on orders" on orders for all using (auth.role() = 'authenticated');
create policy "Admin can do everything on app_settings" on app_settings for all using (auth.role() = 'authenticated');

-- Initial Settings Setup
insert into app_settings (key, value, is_secret) values
('paystack_public_key', '', false),
('paystack_secret_key', '', true),
('store_currency', 'ZAR', false)
on conflict (key) do nothing;
