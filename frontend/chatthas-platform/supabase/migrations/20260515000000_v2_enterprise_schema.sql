-- Phase 1: Database Architecture & Supabase Setup
-- Version 2.0 | Production Grade | Enterprise Hospitality Standard

-- ==========================================================
-- 1. EXTENSIONS & FUNCTIONS
-- ==========================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to automatically update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================================
-- 2. MENU SYSTEM EXTENSIONS
-- ==========================================================

-- Product Variants
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, -- e.g., 'Small', 'Medium', 'Spicy', 'Mild'
    price_modifier DECIMAL(10, 2) DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Dietary Flags (Enum type)
CREATE TYPE dietary_flag AS ENUM ('vegetarian', 'vegan', 'halal', 'gluten_free', 'contains_nuts', 'spicy');

-- Product Dietary Flags Junction
CREATE TABLE IF NOT EXISTS product_dietary_flags (
    product_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    flag dietary_flag NOT NULL,
    PRIMARY KEY (product_id, flag)
);

-- ==========================================================
-- 3. ORDER SYSTEM EXTENSIONS
-- ==========================================================

-- Order Status Enum
CREATE TYPE order_status_type AS ENUM (
    'pending', 'accepted', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'
);

-- Order Status History (Audit Trail)
CREATE TABLE IF NOT EXISTS order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    status order_status_type NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Order Locations (Precise Map Data)
CREATE TABLE IF NOT EXISTS order_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE UNIQUE,
    lat DECIMAL(10, 8) NOT NULL,
    lng DECIMAL(11, 8) NOT NULL,
    plus_code VARCHAR(20),
    formatted_address TEXT NOT NULL,
    accuracy_meters INTEGER,
    delivery_zone_id UUID REFERENCES delivery_zones(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================================
-- 4. CMS SYSTEM
-- ==========================================================

CREATE TABLE IF NOT EXISTS homepage_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_type VARCHAR(50) NOT NULL, -- 'hero', 'strip', 'announcement'
    title VARCHAR(255),
    subtitle TEXT,
    media_url TEXT,
    cta_text VARCHAR(100),
    cta_url VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS featured_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================================
-- 5. USER SYSTEM & RBAC
-- ==========================================================

CREATE TYPE admin_role_type AS ENUM (
    'super_admin', 'branch_manager', 'kitchen_staff', 'delivery_manager', 'content_manager', 'support_team'
);

CREATE TABLE IF NOT EXISTS admin_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES admins(id) ON DELETE CASCADE UNIQUE,
    role admin_role_type NOT NULL DEFAULT 'support_team',
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL, -- Null means all branches (super admin)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES admins(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    table_name VARCHAR(255),
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================================
-- 6. SETTINGS & ANALYTICS
-- ==========================================================

CREATE TABLE IF NOT EXISTS platform_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tax_rate_online DECIMAL(5,2) DEFAULT 5.00,
    tax_rate_cod DECIMAL(5,2) DEFAULT 16.00,
    global_delivery_fee DECIMAL(10,2) DEFAULT 150.00,
    min_order_value DECIMAL(10,2) DEFAULT 0.00,
    whatsapp_number VARCHAR(50),
    meta_pixel_id VARCHAR(100),
    ga4_measurement_id VARCHAR(100),
    posthog_api_key VARCHAR(100),
    updated_by UUID REFERENCES admins(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default settings row
INSERT INTO platform_settings (id) VALUES (uuid_generate_v4()) ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL, -- 'ViewContent', 'AddToCart', etc.
    customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    event_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================================
-- 7. TRIGGERS & POLICIES
-- ==========================================================

-- Apply updated_at triggers
CREATE TRIGGER set_product_variants_updated_at BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_homepage_sections_updated_at BEFORE UPDATE ON homepage_sections FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_admin_roles_updated_at BEFORE UPDATE ON admin_roles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_platform_settings_updated_at BEFORE UPDATE ON platform_settings FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Add Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_locations_order_id ON order_locations(order_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_id ON audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
