-- 20260401000001_multi_image_support.sql
-- Add support for multiple image galleries per product

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS image_urls text[] DEFAULT '{}';

-- Migrate existing single image_url to the first position of the array
UPDATE products 
SET image_urls = array[image_url]
WHERE image_url IS NOT NULL 
AND (image_urls IS NULL OR array_length(image_urls, 1) IS NULL);

-- Optional: Comment for documentation
COMMENT ON COLUMN products.image_urls IS 'Array of high-resolution product image URLs for carousel display';
