-- Promo Codes table
CREATE TABLE IF NOT EXISTS public.promo_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC NOT NULL,
    min_order_amount NUMERIC DEFAULT 0,
    max_discount_amount NUMERIC,
    starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Home Page Banners table
CREATE TABLE IF NOT EXISTS public.homepage_banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_url TEXT NOT NULL,
    title TEXT,
    subtitle TEXT,
    button_text TEXT,
    button_link TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies for Admins
CREATE POLICY "Admins can manage promo codes" ON promo_codes FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage homepage banners" ON homepage_banners FOR ALL USING (is_admin());

-- Public access for banners
ALTER TABLE homepage_banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active banners" ON homepage_banners FOR SELECT USING (is_active = true);

-- Public access for promo codes (for validation during checkout)
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active promo codes" ON promo_codes FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()));

-- Seed the initial banner (current one)
INSERT INTO public.homepage_banners (image_url, title, subtitle, button_text, button_link, display_order)
VALUES ('/hero.png', 'Making Desi Food Great Again.', 'Cooked in organic desi ghee from our own farm. From halwa puri to midnight karahi — across 4 branches in the twin cities.', 'Explore Menu', '/menu', 0);
