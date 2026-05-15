-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table 1: users (extends Supabase auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    address_default TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Table 2: admins
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('super_admin', 'branch_admin', 'viewer')),
    branch_ids UUID[], -- NULL means all branches
    created_by UUID REFERENCES admins(id),
    last_login TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true
);

-- Table 3: categories
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    branch_ids UUID[]
);

-- Table 4: menu_items
CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    badge TEXT CHECK (badge IN ('bestseller','new','spicy','popular') OR badge IS NULL),
    variants JSONB DEFAULT '[]'::jsonb,
    allergens TEXT[] DEFAULT '{}',
    branch_ids UUID[],
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Table 9: branches (needed before orders)
CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    address TEXT,
    city TEXT,
    phone TEXT,
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    operating_hours JSONB DEFAULT '{}'::jsonb,
    is_accepting_orders BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0
);

-- Table 8: coupons (needed before orders)
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    type TEXT CHECK (type IN ('percent','fixed','free_delivery')),
    value NUMERIC(10,2) NOT NULL CHECK (value > 0),
    min_order_amount NUMERIC(10,2) DEFAULT 0,
    max_discount_amount NUMERIC(10,2),
    usage_limit INT,
    used_count INT DEFAULT 0,
    per_user_limit INT DEFAULT 1,
    valid_from TIMESTAMPTZ,
    valid_until TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    branch_ids UUID[]
);

-- Table 5: orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    branch_id UUID REFERENCES branches(id),
    status TEXT CHECK (status IN ('pending','confirmed','preparing','ready','out_for_delivery','delivered','cancelled')),
    type TEXT CHECK (type IN ('delivery','pickup','dine_in')),
    subtotal NUMERIC(10,2) NOT NULL,
    discount_amount NUMERIC(10,2) DEFAULT 0,
    delivery_fee NUMERIC(10,2) DEFAULT 0,
    total NUMERIC(10,2) NOT NULL,
    coupon_id UUID REFERENCES coupons(id),
    payment_method TEXT CHECK (payment_method IN ('stripe','safepay','payfast','cod','wallet')),
    payment_status TEXT CHECK (payment_status IN ('pending','paid','failed','refunded')),
    payment_reference TEXT,
    delivery_address TEXT,
    customer_notes TEXT,
    internal_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    estimated_delivery_at TIMESTAMPTZ
);

-- Table 6: order_items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id),
    item_name TEXT NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL,
    quantity INT CHECK (quantity > 0) NOT NULL,
    variant_label TEXT,
    addons JSONB DEFAULT '[]'::jsonb,
    line_total NUMERIC(10,2) NOT NULL
);

-- Table 7: customers
CREATE TABLE customers (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    total_orders INT DEFAULT 0,
    total_spent NUMERIC(12,2) DEFAULT 0,
    last_order_at TIMESTAMPTZ,
    preferred_branch_id UUID REFERENCES branches(id),
    marketing_opt_in BOOLEAN DEFAULT false,
    whatsapp_opt_in BOOLEAN DEFAULT false,
    customer_tier TEXT DEFAULT 'standard' CHECK (customer_tier IN ('standard','silver','gold','platinum')),
    notes TEXT
);

-- Table 10: banners
CREATE TABLE banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT,
    image_url TEXT,
    link_url TEXT,
    position TEXT CHECK (position IN ('hero','mid_page','footer','popup')),
    display_order INT DEFAULT 0,
    branch_ids UUID[],
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true
);

-- Table 11: homepage_sections
CREATE TABLE homepage_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_type TEXT CHECK (section_type IN ('hero','featured_categories','offers_strip','testimonials','stats','about','cta','newsletter')),
    heading TEXT,
    subheading TEXT,
    body_content TEXT,
    media_url TEXT,
    cta_label TEXT,
    cta_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    config JSONB DEFAULT '{}'::jsonb
);

-- Table 12: analytics_events
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type TEXT CHECK (event_type IN ('view_content','add_to_cart','initiate_checkout','purchase','coupon_applied','branch_selected')),
    user_id UUID REFERENCES users(id),
    session_id TEXT,
    properties JSONB DEFAULT '{}'::jsonb,
    ip_hash TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Table 13: notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT CHECK (type IN ('new_order','order_cancelled','low_stock','system_alert','new_customer')),
    title TEXT,
    body TEXT,
    related_id UUID,
    branch_id UUID REFERENCES branches(id),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Table 14: delivery_settings
CREATE TABLE delivery_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID UNIQUE REFERENCES branches(id) ON DELETE CASCADE,
    base_fee NUMERIC(8,2) DEFAULT 0,
    free_delivery_above NUMERIC(8,2),
    min_order_amount NUMERIC(8,2) DEFAULT 0,
    estimated_time_minutes INT DEFAULT 45,
    delivery_radius_km NUMERIC(5,2) DEFAULT 5.0,
    zones JSONB DEFAULT '[]'::jsonb,
    is_delivery_enabled BOOLEAN DEFAULT true
);

-- Table 15: website_settings
CREATE TABLE website_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    "group" TEXT CHECK ("group" IN ('brand','contact','seo','tracking','payments','features','operating')),
    description TEXT,
    is_secret BOOLEAN DEFAULT false,
    updated_by UUID REFERENCES admins(id),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;

-- Basic Public Read Policies (for Next.js fetching)
CREATE POLICY "Public profiles are viewable by everyone." ON users FOR SELECT USING (true);
CREATE POLICY "Categories are viewable by everyone." ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Menu items are viewable by everyone." ON menu_items FOR SELECT USING (is_available = true);
CREATE POLICY "Branches are viewable by everyone." ON branches FOR SELECT USING (true);
CREATE POLICY "Banners are viewable by everyone." ON banners FOR SELECT USING (is_active = true);
CREATE POLICY "Homepage sections are viewable by everyone." ON homepage_sections FOR SELECT USING (is_active = true);
CREATE POLICY "Delivery settings are viewable by everyone." ON delivery_settings FOR SELECT USING (true);
CREATE POLICY "Public settings are viewable by everyone." ON website_settings FOR SELECT USING (is_secret = false);

-- User Policies
CREATE POLICY "Users can insert their own profile." ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own orders." ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own order items." ON order_items FOR SELECT USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

-- Realtime replication setup
ALTER PUBLICATION supabase_realtime ADD TABLE orders, notifications, menu_items, website_settings;
