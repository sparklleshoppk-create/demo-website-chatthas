-- Add inventory columns to menu_items
ALTER TABLE menu_items ADD COLUMN track_inventory BOOLEAN DEFAULT false;
ALTER TABLE menu_items ADD COLUMN stock_quantity INT DEFAULT 0;
