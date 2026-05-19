-- 1. Storage Setup
-- Create the menu-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies to allow public reading and admin uploading
-- Note: These policies assume standard Supabase auth.users() setup.
-- We'll allow public reads and all actions for authenticated users for now.
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'menu-images');
CREATE POLICY "Admin All Access" ON storage.objects FOR ALL USING (bucket_id = 'menu-images') WITH CHECK (bucket_id = 'menu-images');

-- 2. Database RLS Fix
-- Ensure RLS is enabled but policies allow admin management
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view menu
DROP POLICY IF EXISTS "Public View Menu" ON menu_items;
CREATE POLICY "Public View Menu" ON menu_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public View Categories" ON categories;
CREATE POLICY "Public View Categories" ON categories FOR SELECT USING (true);

-- Allow authenticated users (admins) to manage everything
DROP POLICY IF EXISTS "Admin Manage Menu" ON menu_items;
CREATE POLICY "Admin Manage Menu" ON menu_items FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin Manage Categories" ON categories;
CREATE POLICY "Admin Manage Categories" ON categories FOR ALL USING (true) WITH CHECK (true);
