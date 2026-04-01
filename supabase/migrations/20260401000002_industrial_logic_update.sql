-- 20260401000002_industrial_logic_update.sql
-- Add 'New In' and 'Gallery Caption' support

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT FALSE;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS caption TEXT;

COMMENT ON COLUMN products.is_new IS 'Tracks if the product is a "New In" item for priority storefront sorting.';
COMMENT ON COLUMN products.caption IS 'Caption for Gallery items (e.g., "Recent Client Work").';
