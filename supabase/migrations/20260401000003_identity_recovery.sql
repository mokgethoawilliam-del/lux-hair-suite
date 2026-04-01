-- 1. Sites Table RLS Fix
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on sites" ON sites FOR SELECT USING (true);
CREATE POLICY "Allow authenticated CRUD on sites" ON sites FOR ALL USING (auth.role() = 'authenticated');

-- 2. Bookings Table RLS Fix
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on bookings" ON bookings FOR SELECT USING (true);
CREATE POLICY "Allow public insert on bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated CRUD on bookings" ON bookings FOR ALL USING (auth.role() = 'authenticated');

-- 3. Site Metadata Column Fix (Isolation)
-- Ensure 'site_id' is NOT NULL for future installations
ALTER TABLE site_metadata ALTER COLUMN site_id SET NOT NULL;
