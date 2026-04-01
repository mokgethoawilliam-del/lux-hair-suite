-- 1. Ensure the definitive Lux Hair Site exists
-- We use 'lux-hair-suite' as the slug to match the production domain
INSERT INTO sites (name, subdomain_slug)
VALUES ('Kagiso Hair Suite', 'lux-hair-suite')
ON CONFLICT (subdomain_slug) DO UPDATE 
SET name = 'Kagiso Hair Suite';

-- 2. Identity Alignment: Move data from 'default' to 'lux-hair-suite'
DO $$ 
DECLARE 
    target_site_id UUID;
    default_site_id UUID;
BEGIN
    SELECT id INTO target_site_id FROM sites WHERE subdomain_slug = 'lux-hair-suite' LIMIT 1;
    SELECT id INTO default_site_id FROM sites WHERE subdomain_slug = 'default' LIMIT 1;
    
    IF target_site_id IS NOT NULL THEN
        -- Move Products (Services, Gallery, etc.)
        UPDATE products 
        SET site_id = target_site_id 
        WHERE site_id = default_site_id OR site_id IS NULL;

        -- Move Orders/Leads/Metadata
        UPDATE orders SET site_id = target_site_id WHERE site_id = default_site_id OR site_id IS NULL;
        UPDATE leads SET site_id = target_site_id WHERE site_id = default_site_id OR site_id IS NULL;
        UPDATE site_metadata SET site_id = target_site_id WHERE site_id = default_site_id OR site_id IS NULL;
        UPDATE app_settings SET site_id = target_site_id WHERE site_id = default_site_id OR site_id IS NULL;
    END IF;
END $$;
