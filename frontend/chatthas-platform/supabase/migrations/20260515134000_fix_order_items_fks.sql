-- Migration to fix foreign key constraints and missing columns
-- This ensures the database is compatible with the latest seeding scripts

-- 1. Fix menu_item_id constraint
ALTER TABLE public.order_items 
DROP CONSTRAINT IF EXISTS order_items_menu_item_id_fkey;

ALTER TABLE public.order_items
ADD CONSTRAINT order_items_menu_item_id_fkey 
FOREIGN KEY (menu_item_id) REFERENCES public.menu_items(id) ON DELETE CASCADE;

-- 2. Fix order_id constraint
ALTER TABLE public.order_items 
DROP CONSTRAINT IF EXISTS order_items_order_id_fkey;

ALTER TABLE public.order_items
ADD CONSTRAINT order_items_order_id_fkey 
FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;

-- 3. Ensure all required columns exist in menu_items
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='menu_items' AND column_name='variants') THEN
        ALTER TABLE menu_items ADD COLUMN variants JSONB DEFAULT '[]'::jsonb;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='menu_items' AND column_name='addons') THEN
        ALTER TABLE menu_items ADD COLUMN addons JSONB DEFAULT '[]'::jsonb;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='menu_items' AND column_name='dietary_flags') THEN
        ALTER TABLE menu_items ADD COLUMN dietary_flags JSONB DEFAULT '[]'::jsonb;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='menu_items' AND column_name='track_inventory') THEN
        ALTER TABLE menu_items ADD COLUMN track_inventory BOOLEAN DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='menu_items' AND column_name='stock_quantity') THEN
        ALTER TABLE menu_items ADD COLUMN stock_quantity INT DEFAULT 0;
    END IF;
END $$;
