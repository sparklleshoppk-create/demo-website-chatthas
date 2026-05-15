-- Gallery table
CREATE TABLE IF NOT EXISTS public.gallery_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    type TEXT DEFAULT 'image' CHECK (type IN ('image', 'video')),
    category TEXT DEFAULT 'food' CHECK (category IN ('food', 'interior', 'experience', 'video')),
    image_url TEXT NOT NULL,
    video_id TEXT,
    span_class TEXT DEFAULT 'col-span-1 row-span-1',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for gallery
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view gallery" ON gallery_items FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage gallery" ON gallery_items FOR ALL USING (is_admin());

-- Seed data
INSERT INTO public.gallery_items (title, category, image_url, span_class, display_order)
VALUES 
('Signature Biryani', 'food', 'https://images.unsplash.com/photo-1589302168068-964664d93cb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'col-span-1 row-span-1', 1),
('F-10 Flagship Interior', 'interior', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'col-span-1 row-span-2', 2),
('Desi Ghee Karahi', 'food', 'https://images.unsplash.com/photo-1544025162-8482436151f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'col-span-2 row-span-2', 3),
('Beverly Centre Branch', 'interior', 'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'col-span-1 row-span-1', 4);
