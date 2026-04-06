-- RECOVERY: CHECKOUT PERSISTENCE & RLS ENFORCEMENT
-- This migration ensures that public customers can securely 
-- register themselves and their orders while maintaining 
-- strict multi-tenant isolation.

-- 1. Refine Customer Identity Constraints (Isolation)
-- Drop existing global unique constraints if they exist
ALTER TABLE customers DROP CONSTRAINT IF EXISTS customers_whatsapp_number_key;
ALTER TABLE customers DROP CONSTRAINT IF EXISTS customers_email_key;

-- Create composite unique constraints bound to the site_id
-- This allows the same customer (same number/email) to exist across multiple shops
ALTER TABLE customers ADD CONSTRAINT customers_site_whatsapp_key UNIQUE (site_id, whatsapp_number);
ALTER TABLE customers ADD CONSTRAINT customers_site_email_key UNIQUE (site_id, email);

-- 2. Enable Public Order Capture (RLS Insert)
-- Customers (anon users) must be able to insert their own profile and order data
-- We limit this strictly to INSERT since they shouldn't be browsing the order table.
CREATE POLICY "Allow public insert on customers" 
ON customers FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public insert on orders" 
ON orders FOR INSERT 
WITH CHECK (true);

-- 3. Ensure Delivery Zones are fully readable by Checkout
-- (Already exists, but adding as a safety measure for clean instances)
DROP POLICY IF EXISTS "Public can view delivery zones on checkout" ON delivery_zones;
CREATE POLICY "Public can view delivery zones on checkout" 
ON delivery_zones FOR SELECT 
USING (true);

-- 4. Enable Public Read on Products for Checkout validation
-- (Redundant if rls_fix.sql was run, but added for recovery robustness)
DROP POLICY IF EXISTS "Allow public read access on products" ON products;
CREATE POLICY "Allow public read access on products" 
ON products FOR SELECT 
USING (true);
