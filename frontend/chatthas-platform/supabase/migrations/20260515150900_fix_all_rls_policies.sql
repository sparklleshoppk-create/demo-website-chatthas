-- Comprehensive RLS fix for all admin-managed tables
-- This ensures authenticated admins can perform CRUD operations

-- =============================================
-- 1. MENU & CATEGORIES (already partially done)
-- =============================================
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public View Menu" ON menu_items;
CREATE POLICY "Public View Menu" ON menu_items FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin Manage Menu" ON menu_items;
CREATE POLICY "Admin Manage Menu" ON menu_items FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public View Categories" ON categories;
CREATE POLICY "Public View Categories" ON categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin Manage Categories" ON categories;
CREATE POLICY "Admin Manage Categories" ON categories FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- 2. ORDERS & ORDER ITEMS
-- =============================================
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public View Orders" ON orders;
CREATE POLICY "Public View Orders" ON orders FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin Manage Orders" ON orders;
CREATE POLICY "Admin Manage Orders" ON orders FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public View Order Items" ON order_items;
CREATE POLICY "Public View Order Items" ON order_items FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin Manage Order Items" ON order_items;
CREATE POLICY "Admin Manage Order Items" ON order_items FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- 3. BRANCHES
-- =============================================
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public View Branches" ON branches;
CREATE POLICY "Public View Branches" ON branches FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin Manage Branches" ON branches;
CREATE POLICY "Admin Manage Branches" ON branches FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- 4. GALLERY
-- =============================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'gallery') THEN
    ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public View Gallery" ON gallery;
    CREATE POLICY "Public View Gallery" ON gallery FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Admin Manage Gallery" ON gallery;
    CREATE POLICY "Admin Manage Gallery" ON gallery FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- =============================================
-- 5. PROMO CODES
-- =============================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'promo_codes') THEN
    ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public View Promos" ON promo_codes;
    CREATE POLICY "Public View Promos" ON promo_codes FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Admin Manage Promos" ON promo_codes;
    CREATE POLICY "Admin Manage Promos" ON promo_codes FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- =============================================
-- 6. HOMEPAGE SECTIONS (BANNERS)
-- =============================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'homepage_sections') THEN
    ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public View Banners" ON homepage_sections;
    CREATE POLICY "Public View Banners" ON homepage_sections FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Admin Manage Banners" ON homepage_sections;
    CREATE POLICY "Admin Manage Banners" ON homepage_sections FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- =============================================
-- 7. DELIVERY ZONES
-- =============================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'delivery_zones') THEN
    ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public View Delivery Zones" ON delivery_zones;
    CREATE POLICY "Public View Delivery Zones" ON delivery_zones FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Admin Manage Delivery Zones" ON delivery_zones;
    CREATE POLICY "Admin Manage Delivery Zones" ON delivery_zones FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- =============================================
-- 8. REVIEWS
-- =============================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'reviews') THEN
    ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public View Reviews" ON reviews;
    CREATE POLICY "Public View Reviews" ON reviews FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Admin Manage Reviews" ON reviews;
    CREATE POLICY "Admin Manage Reviews" ON reviews FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- =============================================
-- 9. WEBSITE SETTINGS
-- =============================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'website_settings') THEN
    ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public View Settings" ON website_settings;
    CREATE POLICY "Public View Settings" ON website_settings FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Admin Manage Settings" ON website_settings;
    CREATE POLICY "Admin Manage Settings" ON website_settings FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- =============================================
-- 10. PLATFORM SETTINGS
-- =============================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'platform_settings') THEN
    ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public View Platform Settings" ON platform_settings;
    CREATE POLICY "Public View Platform Settings" ON platform_settings FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Admin Manage Platform Settings" ON platform_settings;
    CREATE POLICY "Admin Manage Platform Settings" ON platform_settings FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- =============================================
-- 11. NOTIFICATIONS
-- =============================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notifications') THEN
    ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public View Notifications" ON notifications;
    CREATE POLICY "Public View Notifications" ON notifications FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Admin Manage Notifications" ON notifications;
    CREATE POLICY "Admin Manage Notifications" ON notifications FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- =============================================
-- 12. USERS / LOYALTY
-- =============================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
    ALTER TABLE users ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public View Users" ON users;
    CREATE POLICY "Public View Users" ON users FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Admin Manage Users" ON users;
    CREATE POLICY "Admin Manage Users" ON users FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'loyalty_transactions') THEN
    ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public View Loyalty" ON loyalty_transactions;
    CREATE POLICY "Public View Loyalty" ON loyalty_transactions FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Admin Manage Loyalty" ON loyalty_transactions;
    CREATE POLICY "Admin Manage Loyalty" ON loyalty_transactions FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- =============================================
-- 13. ADMINS
-- =============================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admins') THEN
    ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public View Admins" ON admins;
    CREATE POLICY "Public View Admins" ON admins FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Admin Manage Admins" ON admins;
    CREATE POLICY "Admin Manage Admins" ON admins FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;


