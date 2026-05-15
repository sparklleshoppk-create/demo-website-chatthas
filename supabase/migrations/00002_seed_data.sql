-- Seed Categories
INSERT INTO categories (id, name, slug, description, display_order)
VALUES 
  ('10000000-0000-0000-0000-000000000001', 'Nashta (Breakfast)', 'nashta', 'Authentic Pakistani breakfast items', 1),
  ('10000000-0000-0000-0000-000000000002', 'Karahi & Handi', 'karahi', 'Slow-cooked karahis in desi ghee', 2),
  ('10000000-0000-0000-0000-000000000003', 'Biryani & Rice', 'biryani', 'Fragrant rice dishes', 3),
  ('10000000-0000-0000-0000-000000000004', 'Nihari & Paye', 'nihari', 'Slow-cooked overnight specialties', 4)
ON CONFLICT (id) DO NOTHING;

-- Seed Menu Items
INSERT INTO menu_items (category_id, name, slug, description, price, badge, is_featured)
VALUES 
  ('10000000-0000-0000-0000-000000000001', 'Halwa Puri Platter', 'halwa-puri-platter', 'Suji halwa, crispy fried puri, Lahori chana & aloo bhaji. Islamabad''s most celebrated breakfast.', 450.00, 'bestseller', true),
  ('10000000-0000-0000-0000-000000000001', 'Lahori Chana', 'lahori-chana', 'Richly spiced chickpeas in the authentic Lahori tradition — the best in Islamabad.', 180.00, 'popular', true),
  ('10000000-0000-0000-0000-000000000002', 'Desi Ghee Mutton Karahi', 'desi-ghee-mutton-karahi', 'Our crowning glory — tender mutton, cooked in organic farm-sourced desi ghee in a cast iron wok.', 1800.00, 'bestseller', true),
  ('10000000-0000-0000-0000-000000000002', 'Chicken Makhani Handi', 'chicken-makhani-handi', 'Buttery, rich makhani handi cooked slow in a clay pot. Soul food at its finest.', 850.00, 'popular', false),
  ('10000000-0000-0000-0000-000000000003', 'Chattha''s Special Chicken Biryani', 'special-chicken-biryani', 'Mint, dried plum, lemon zest, and farm-grown rice.', 480.00, 'bestseller', true),
  ('10000000-0000-0000-0000-000000000004', 'Beef Nalli Nihari', 'beef-nalli-nihari', 'Pure bone-marrow nihari — "scrumptious". Slow-cooked overnight.', 650.00, 'bestseller', true)
ON CONFLICT (slug) DO NOTHING;

-- Seed Branches
INSERT INTO branches (id, name, slug, address, is_accepting_orders)
VALUES
  ('20000000-0000-0000-0000-000000000001', 'Tariq Market F-10/2', 'f-10-flagship', 'Plaza 1N, Street 14, Tariq Market, F-10/2, Islamabad', true),
  ('20000000-0000-0000-0000-000000000002', 'Beverly Centre F-6', 'beverly-centre-f6', 'Shop 18, Lower Ground, Beverly Centre, Jinnah Ave, F-6/1, Islamabad', true)
ON CONFLICT (slug) DO NOTHING;
