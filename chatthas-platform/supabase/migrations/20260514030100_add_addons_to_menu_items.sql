-- Add addons column to menu_items table
ALTER TABLE menu_items ADD COLUMN addons JSONB DEFAULT '[]'::jsonb;
