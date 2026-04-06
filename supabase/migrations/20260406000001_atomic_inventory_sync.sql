-- ATOMIC INVENTORY SYNC: Automated Stock Management
-- This function handles the safe decrement of product stock levels 
-- during checkout, preventing race conditions.

CREATE OR REPLACE FUNCTION decrement_stock(p_id UUID, p_quantity INT DEFAULT 1)
RETURNS VOID AS $$
BEGIN
    UPDATE products
    SET stock_count = GREATEST(0, stock_count - p_quantity)
    WHERE id = p_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant access to the service role or authenticated/anon if needed
-- (Since the edge function/client will call it)
GRANT EXECUTE ON FUNCTION decrement_stock(UUID, INT) TO anon, authenticated, service_role;
