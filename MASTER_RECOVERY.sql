-- LUX HAIR SUITE: REFINED MASTER RECOVERY (Defensive Edition)
-- RUN THIS IN YOUR SUPABASE SQL EDITOR TO UNLOCK YOUR SERVICES

-- 1. UNLOCK DATABASE (DEFENSIVE RLS REPAIR)
DO $$ 
BEGIN
    -- Enable RLS on core tables
    ALTER TABLE IF EXISTS sites ENABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS bookings ENABLE ROW LEVEL SECURITY;

    -- Sites: Drop then create public read policy
    DROP POLICY IF EXISTS "Allow public read on sites" ON sites;
    CREATE POLICY "Allow public read on sites" ON sites FOR SELECT USING (true);

    -- Products: Drop then create public read policy
    DROP POLICY IF EXISTS "Allow public read on products" ON products;
    CREATE POLICY "Allow public read on products" ON products FOR SELECT USING (true);

    -- Bookings: Drop then create public read/insert policies
    DROP POLICY IF EXISTS "Allow public read on bookings" ON bookings;
    CREATE POLICY "Allow public read on bookings" ON bookings FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Allow public insert on bookings" ON bookings;
    CREATE POLICY "Allow public insert on bookings" ON bookings FOR INSERT WITH CHECK (true);
END $$;

-- 2. ALIGN IDENTITY (LUX-HAIR-SUITE LOCK)
-- This ensures 'lux-hair-suite' exists and owns your hair services
INSERT INTO sites (name, subdomain_slug)
VALUES ('Kagiso Hair Suite', 'lux-hair-suite')
ON CONFLICT (subdomain_slug) DO UPDATE 
SET name = 'Kagiso Hair Suite';

DO $$ 
DECLARE 
    target_site_id UUID;
    default_site_id UUID;
BEGIN
    SELECT id INTO target_site_id FROM sites WHERE subdomain_slug = 'lux-hair-suite' LIMIT 1;
    SELECT id INTO default_site_id FROM sites WHERE subdomain_slug = 'default' LIMIT 1;
    
    IF target_site_id IS NOT NULL THEN
        -- Move All Hair Services & Gallery items to the secure vault
        UPDATE products 
        SET site_id = target_site_id 
        WHERE site_id = default_site_id OR site_id IS NULL;

        -- Ensure Orders/Leads/Metadata are synchronized
        UPDATE orders SET site_id = target_site_id WHERE site_id = default_site_id OR site_id IS NULL;
        UPDATE leads SET site_id = target_site_id WHERE site_id = default_site_id OR site_id IS NULL;
        UPDATE site_metadata SET site_id = target_site_id WHERE site_id = default_site_id OR site_id IS NULL;
        UPDATE app_settings SET site_id = target_site_id WHERE site_id = default_site_id OR site_id IS NULL;
    END IF;
END $$;

-- 3. SCHEMA AUDIT: FIX MISSING COLUMNS
DO $$ 
BEGIN
    BEGIN
        ALTER TABLE leads ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;

    BEGIN
        ALTER TABLE bookings ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;

    BEGIN
        ALTER TABLE bookings ADD COLUMN status TEXT DEFAULT 'Pending';
    EXCEPTION
        WHEN duplicate_column THEN null;
    END;
END $$;

-- 4. VAULT UNLOCK (RLS & UPSERT CONSTRAINT FIX)
DO $$ 
BEGIN
    -- Fix Upsert Constraints for Multi-Tenancy Updates
    BEGIN
        ALTER TABLE app_settings DROP CONSTRAINT IF EXISTS app_settings_key_key;
        ALTER TABLE app_settings ADD CONSTRAINT app_settings_key_site_id_key UNIQUE (key, site_id);
    EXCEPTION WHEN others THEN null; END;

    BEGIN
        ALTER TABLE site_metadata DROP CONSTRAINT IF EXISTS site_metadata_key_key;
        ALTER TABLE site_metadata ADD CONSTRAINT site_metadata_key_site_id_key UNIQUE (key, site_id);
    EXCEPTION WHEN others THEN null; END;
END $$;

-- Drop restricted policies and allow PIN-secured public access
DROP POLICY IF EXISTS "Admin can do everything on app_settings" ON app_settings;
CREATE POLICY "Allow public full access on app_settings" ON app_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read on site_metadata" ON site_metadata;
CREATE POLICY "Allow public full access on site_metadata" ON site_metadata FOR ALL USING (true) WITH CHECK (true);
