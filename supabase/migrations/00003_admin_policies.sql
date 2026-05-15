-- Admin write policies for CRUD operations
-- These policies allow authenticated users who exist in the admins table
-- to perform INSERT, UPDATE, DELETE operations

-- Helper: Check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins 
    WHERE user_id = auth.uid() 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Menu Items: Admin full access
CREATE POLICY "Admins can insert menu items" ON menu_items FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update menu items" ON menu_items FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete menu items" ON menu_items FOR DELETE USING (is_admin());
-- Allow admins to also see unavailable items
CREATE POLICY "Admins can view all menu items" ON menu_items FOR SELECT USING (is_admin());

-- Categories: Admin full access
CREATE POLICY "Admins can insert categories" ON categories FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update categories" ON categories FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete categories" ON categories FOR DELETE USING (is_admin());
CREATE POLICY "Admins can view all categories" ON categories FOR SELECT USING (is_admin());

-- Branches: Admin full access
CREATE POLICY "Admins can insert branches" ON branches FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update branches" ON branches FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete branches" ON branches FOR DELETE USING (is_admin());

-- Orders: Admin full access
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update orders" ON orders FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can insert orders" ON orders FOR INSERT WITH CHECK (is_admin());

-- Order Items: Admin full access
CREATE POLICY "Admins can view all order items" ON order_items FOR SELECT USING (is_admin());

-- Customers: Admin full access
CREATE POLICY "Admins can view all customers" ON customers FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update customers" ON customers FOR UPDATE USING (is_admin());

-- Banners: Admin full access
CREATE POLICY "Admins can insert banners" ON banners FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update banners" ON banners FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete banners" ON banners FOR DELETE USING (is_admin());

-- Homepage Sections: Admin full access
CREATE POLICY "Admins can insert homepage sections" ON homepage_sections FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update homepage sections" ON homepage_sections FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete homepage sections" ON homepage_sections FOR DELETE USING (is_admin());

-- Notifications: Admin full access
CREATE POLICY "Admins can view notifications" ON notifications FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update notifications" ON notifications FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can insert notifications" ON notifications FOR INSERT WITH CHECK (is_admin());

-- Delivery Settings: Admin full access
CREATE POLICY "Admins can insert delivery settings" ON delivery_settings FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update delivery settings" ON delivery_settings FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete delivery settings" ON delivery_settings FOR DELETE USING (is_admin());

-- Website Settings: Admin full access
CREATE POLICY "Admins can insert website settings" ON website_settings FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update website settings" ON website_settings FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete website settings" ON website_settings FOR DELETE USING (is_admin());
CREATE POLICY "Admins can view all website settings" ON website_settings FOR SELECT USING (is_admin());

-- Coupons: Admin full access
CREATE POLICY "Admins can insert coupons" ON coupons FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update coupons" ON coupons FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete coupons" ON coupons FOR DELETE USING (is_admin());
CREATE POLICY "Admins can view coupons" ON coupons FOR SELECT USING (is_admin());

-- Admins table: Only super_admins can manage
CREATE POLICY "Admins can view admins" ON admins FOR SELECT USING (is_admin());
