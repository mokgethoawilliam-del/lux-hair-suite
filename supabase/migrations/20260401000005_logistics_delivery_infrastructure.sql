-- Nationwide delivery parameters for the Storefront
CREATE TABLE IF NOT EXISTS delivery_zones (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  site_id UUID REFERENCES sites(id),
  name TEXT NOT NULL,
  fee NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin can run all mutations on delivery_zones" ON delivery_zones FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public can view delivery zones on checkout" ON delivery_zones FOR SELECT USING (true); 

-- Expanded physical tracking constraints for Orders
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS shipping_street TEXT,
ADD COLUMN IF NOT EXISTS shipping_city TEXT,
ADD COLUMN IF NOT EXISTS shipping_province TEXT,
ADD COLUMN IF NOT EXISTS shipping_postal_code TEXT,
ADD COLUMN IF NOT EXISTS delivery_zone_id UUID REFERENCES delivery_zones(id),
ADD COLUMN IF NOT EXISTS delivery_fee NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS delivery_status TEXT DEFAULT 'Pending';

-- Hydrate definitive Delivery Zones for primary store automatically
DO $$ 
DECLARE 
    target_site_id UUID;
BEGIN
    SELECT id INTO target_site_id FROM sites WHERE subdomain_slug = 'lux-hair-suite' LIMIT 1;
    IF target_site_id IS NOT NULL THEN
        -- Setup generic parameters as defaults for easy editing later on Admin Hub
        INSERT INTO delivery_zones (site_id, name, fee) VALUES 
        (target_site_id, 'In-Store Collection', 0),
        (target_site_id, 'Local Area Delivery', 100),
        (target_site_id, 'Nationwide Courier (Aramex/Paxi)', 150)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;
