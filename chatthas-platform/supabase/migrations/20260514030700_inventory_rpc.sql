-- Function to decrement inventory and mark as unavailable if empty
CREATE OR REPLACE FUNCTION decrement_inventory(item_uuid UUID, qty INT)
RETURNS VOID AS $$
BEGIN
    UPDATE menu_items
    SET stock_quantity = stock_quantity - qty
    WHERE id = item_uuid AND track_inventory = true;

    -- Automatically mark as unavailable if stock is 0 or less
    UPDATE menu_items
    SET is_available = false
    WHERE id = item_uuid AND track_inventory = true AND stock_quantity <= 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
