-- 1. STRICT SITE ISOLATION
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;

-- Drop insecure legacy policies
DROP POLICY IF EXISTS "Allow authenticated CRUD on sites" ON sites;
DROP POLICY IF EXISTS "Allow public read on sites" ON sites;

-- READ: Anyone can resolve a site for the storefront
CREATE POLICY "Public site resolution" ON sites FOR SELECT USING (true);

-- INSERT: Authenticated users can create their own sites
CREATE POLICY "Users can create their own sites" ON sites 
FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- UPDATE/DELETE: Only owners can modify their sites
CREATE POLICY "Owners can manage their sites" ON sites 
FOR ALL USING (auth.uid() = owner_id);


-- 2. CASCADE ISOLATION FOR APP SETTINGS
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated CRUD on app_settings" ON app_settings;

CREATE POLICY "Public settings read" ON app_settings FOR SELECT USING (true);
CREATE POLICY "Owner-only settings write" ON app_settings 
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM sites 
        WHERE sites.id = app_settings.site_id 
        AND sites.owner_id = auth.uid()
    )
);


-- 3. CASCADE ISOLATION FOR PRODUCTS (Gallery)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated CRUD on products" ON products;

CREATE POLICY "Public gallery read" ON products FOR SELECT USING (true);
CREATE POLICY "Owner-only product manage" ON products 
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM sites 
        WHERE sites.id = products.site_id 
        AND sites.owner_id = auth.uid()
    )
);


-- 4. CASCADE ISOLATION FOR SITE METADATA
ALTER TABLE site_metadata ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated CRUD on site_metadata" ON site_metadata;

CREATE POLICY "Public metadata read" ON site_metadata FOR SELECT USING (true);
CREATE POLICY "Owner-only metadata manage" ON site_metadata 
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM sites 
        WHERE sites.id = site_metadata.site_id 
        AND sites.owner_id = auth.uid()
    )
);


-- 5. CASCADE ISOLATION FOR LOGISTICS
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner-only logistics manage" ON delivery_zones 
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM sites 
        WHERE sites.id = delivery_zones.site_id 
        AND sites.owner_id = auth.uid()
    )
);
