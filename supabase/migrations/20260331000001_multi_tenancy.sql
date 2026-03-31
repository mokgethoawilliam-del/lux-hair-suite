-- 1. Create SITES table
CREATE TABLE IF NOT EXISTS sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    subdomain_slug TEXT UNIQUE NOT NULL, -- e.g. 'lux-hair' or 'sneaker-plug'
    custom_domain TEXT UNIQUE,           -- e.g. 'lux-hair.co.za'
    owner_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Add site_id to existing tables for isolation
ALTER TABLE products ADD COLUMN IF NOT EXISTS site_id UUID REFERENCES sites(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS site_id UUID REFERENCES sites(id);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS site_id UUID REFERENCES sites(id);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS site_id UUID REFERENCES sites(id);
ALTER TABLE site_metadata ADD COLUMN IF NOT EXISTS site_id UUID REFERENCES sites(id);
ALTER TABLE app_settings ADD COLUMN IF NOT EXISTS site_id UUID REFERENCES sites(id);

-- 3. Create a DEFAULT SITE for the initial user (so they don't lose data)
-- This assumes the current user is already an admin.
-- In a real scenario, we'd do this via the Owner Dashboard.
-- But for the migration, we'll provision a default site for existing rows.

INSERT INTO sites (name, subdomain_slug)
VALUES ('KasiVault Default', 'default')
ON CONFLICT (subdomain_slug) DO NOTHING;

-- 4. Assign the default site to existing data
DO $$ 
DECLARE 
    default_site_id UUID;
BEGIN
    SELECT id INTO default_site_id FROM sites WHERE subdomain_slug = 'default' LIMIT 1;
    
    UPDATE products SET site_id = default_site_id WHERE site_id IS NULL;
    UPDATE orders SET site_id = default_site_id WHERE site_id IS NULL;
    UPDATE leads SET site_id = default_site_id WHERE site_id IS NULL;
    UPDATE customers SET site_id = default_site_id WHERE site_id IS NULL;
    UPDATE site_metadata SET site_id = default_site_id WHERE site_id IS NULL;
    UPDATE app_settings SET site_id = default_site_id WHERE site_id IS NULL;
END $$;
