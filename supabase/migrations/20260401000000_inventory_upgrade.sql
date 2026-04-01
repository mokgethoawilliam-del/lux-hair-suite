-- INVENTORY UPGRADE: Takealot Style
-- Adding Sale Prices, Stock, and Variants

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS original_price numeric,
ADD COLUMN IF NOT EXISTS stock_count integer default 10,
ADD COLUMN IF NOT EXISTS sizes text[] default '{}',
ADD COLUMN IF NOT EXISTS colors text[] default '{}';

-- Optional: Add a comment to the table for documentation
COMMENT ON COLUMN products.original_price IS 'Recommended Retail Price (RRP) for Showing Sales/Discounts';
COMMENT ON COLUMN products.stock_count IS 'Current units in stock';
COMMENT ON COLUMN products.sizes IS 'Available size variants (e.g., UK7, S, 12-inch)';
COMMENT ON COLUMN products.colors IS 'Available color variants (e.g., Emerald, Jet Black)';
