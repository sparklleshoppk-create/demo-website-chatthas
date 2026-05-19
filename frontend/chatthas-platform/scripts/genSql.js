const MENU_CATEGORIES = [
  { id: 'nashta', label: 'Nashta (Breakfast)', uuid: '550e8400-e29b-41d4-a716-446655440000' },
  { id: 'karahi', label: 'Karahi & Handi', uuid: '550e8400-e29b-41d4-a716-446655440001' },
  { id: 'biryani', label: 'Biryani & Rice', uuid: '550e8400-e29b-41d4-a716-446655440002' },
  { id: 'nihari', label: 'Nihari & Paye', uuid: '550e8400-e29b-41d4-a716-446655440003' },
  { id: 'bbq', label: 'BBQ', uuid: '550e8400-e29b-41d4-a716-446655440004' },
  { id: 'breads', label: 'Breads', uuid: '550e8400-e29b-41d4-a716-446655440005' },
  { id: 'desserts', label: 'Desserts', uuid: '550e8400-e29b-41d4-a716-446655440006' },
  { id: 'drinks', label: 'Beverages', uuid: '550e8400-e29b-41d4-a716-446655440007' },
  { id: 'deals', label: 'Deals & Platters', uuid: '550e8400-e29b-41d4-a716-446655440008' },
];

const MENU_ITEMS = [
  { category: 'nashta', name: 'Halwa Puri Platter', description: 'Suji halwa, crispy fried puri, Lahori chana & aloo bhaji. Islamabad\'s most celebrated breakfast.', price: 450, tags: ['bestseller', 'signature'] },
  { category: 'nashta', name: 'Lahori Chana', description: 'Richly spiced chickpeas in the authentic Lahori tradition — the best in Islamabad.', price: 180, tags: ['signature', 'popular'] },
  { category: 'nashta', name: 'Whole Wheat Tandoori Paratha', description: 'Made with organic desi ghee — the signature paratha that made DAWN stop and write about us.', price: 80, tags: ['signature'] },
  { category: 'nashta', name: 'Daal Chana with Paratha', description: 'Slow-cooked desi ghee daal paired with our legendary whole wheat paratha.', price: 250, tags: ['popular', 'bestseller'] },
  { category: 'nashta', name: 'Cheese Omelette', description: '"Next level" as our customers say — fresh farm eggs with melted cheese, cooked to perfection.', price: 220, tags: ['popular'] },
  { category: 'nashta', name: 'Aloo Anda', description: 'A classic Pakistani breakfast staple — spiced potato with egg, cooked in desi ghee.', price: 180, tags: [] },
  { category: 'karahi', name: 'Desi Ghee Mutton Karahi', description: 'Our crowning glory — tender mutton, cooked in organic farm-sourced desi ghee in a cast iron wok.', price: 1400, tags: ['signature', 'bestseller'] },
  { category: 'karahi', name: 'Chicken Koyla Special Karahi', description: 'Char-grilled coal-infused chicken karahi with an irresistible smoky flavour.', price: 950, tags: ['popular'] },
  { category: 'karahi', name: 'White Chicken Karahi', description: '"Was fireee!" — creamy, mellow white karahi that breaks all expectations.', price: 950, tags: ['popular'] },
  { category: 'karahi', name: 'Chicken Makhani Handi', description: 'Buttery, rich makhani handi cooked slow in a clay pot. Soul food at its finest.', price: 850, tags: ['popular'] },
  { category: 'karahi', name: 'Mutton Brain Masala (Maghaz)', description: '"Best mutton brain masala in Islamabad" — spiced, delicate and unforgettable.', price: 750, tags: ['signature'] },
  { category: 'karahi', name: 'Daal Makhni', description: 'DAWN called it "the best in town" — slow-cooked black lentils with a buttery finish.', price: 480, tags: ['popular'] },
  { category: 'karahi', name: 'Palak Paneer', description: 'Fresh spinach and cottage cheese in a fragrant masala. A vegetarian masterpiece.', price: 550, tags: ['popular'] },
  { category: 'biryani', name: "Chattha's Special Chicken Biryani", description: 'Mint, dried plum, lemon zest, and farm-grown rice. "One of the best in Islamabad" — Foodpanda 2026.', price: 480, tags: ['signature', 'bestseller'] },
  { category: 'biryani', name: 'Mutton Biryani', description: 'Slow-cooked mutton biryani on farm-sourced rice. Slow-cooked, never rushed.', price: 620, tags: ['popular'] },
  { category: 'nihari', name: 'Beef Nalli Nihari', description: 'Pure bone-marrow nihari — "scrumptious" per our Foodpanda reviewers. Slow-cooked overnight.', price: 650, tags: ['signature', 'bestseller'] },
  { category: 'nihari', name: 'Beef Nihari (Full)', description: 'Classic slow-cooked beef nihari in traditional spices. Rich, deep, and legendary.', price: 590, tags: ['popular'] },
  { category: 'nihari', name: 'Beef Nihari (Half)', description: 'Half portion of our signature beef nihari — perfect to pair with Roghni Naan.', price: 300, tags: [] },
  { category: 'nihari', name: 'Mutton Paye', description: 'Traditional slow-cooked goat trotters in aromatic spices — a winter morning ritual.', price: 490, tags: [] },
  { category: 'nihari', name: 'Haleem', description: 'Rich slow-cooked lentil and meat stew — the definition of Pakistani comfort food.', price: 420, tags: ['popular'] },
  { category: 'bbq', name: 'Beef Seekh Kebab', description: 'Juicy spiced beef mince on skewers, char-grilled over open flame. Pair with raita.', price: 380, tags: ['popular'] },
  { category: 'bbq', name: 'Chicken Rajasthani Boti', description: 'Tender chicken marinated in Rajasthani spices and char-grilled to perfection.', price: 750, tags: ['popular'] },
  { category: 'bbq', name: 'Malai Boti', description: 'Creamy marinated chicken pieces grilled on skewers — a crowd favourite.', price: 750, tags: ['bestseller'] },
  { category: 'bbq', name: 'Mixed BBQ Platter', description: 'A grand spread of seekh kebab, malai boti, and rajasthani boti — for the whole family.', price: 1800, tags: ['popular'] },
  { category: 'breads', name: 'Whole Wheat Tandoori Paratha', description: 'Our signature — baked in the tandoor with organic desi ghee.', price: 80, tags: ['signature'] },
  { category: 'breads', name: 'Roghni Naan', description: '"Scrumptious" — buttered soft naan fresh from the tandoor.', price: 60, tags: ['popular'] },
  { category: 'breads', name: 'Kulcha', description: 'Fluffy leavened bread — best with halwa puri or nihari.', price: 50, tags: [] },
  { category: 'breads', name: 'Tandoori Roti', description: 'Classic tandoor-baked roti — the everyday essential.', price: 30, tags: [] },
  { category: 'desserts', name: "Founder's Sugarcane Brownie", description: '"I made this myself — using sugarcane instead of crystal sugar to give it a local flavor." — Waqar Chattha', price: 280, tags: ['signature', 'new'] },
  { category: 'desserts', name: 'Kheer', description: 'Traditional rice pudding made with farm-fresh milk. Slow-cooked, generously sweet.', price: 180, tags: ['popular'] },
  { category: 'drinks', name: 'Namkeen Lassi', description: 'Salted lassi served in traditional stainless steel glass. "Perfectly chilled" — every time.', price: 150, tags: ['signature', 'bestseller'] },
  { category: 'drinks', name: 'Meethi Lassi', description: 'Sweet lassi made with farm-fresh pure milk. Creamy, cold, and deeply satisfying.', price: 150, tags: ['popular'] },
  { category: 'drinks', name: 'Fresh Juice', description: '"Another level" — freshly pressed seasonal fruit juices. No concentrates, ever.', price: 180, tags: ['popular'] },
  { category: 'drinks', name: 'Mint Margarita', description: 'Refreshing non-alcoholic minty cooler — the perfect companion to BBQ.', price: 200, tags: ['popular'] },
  { category: 'drinks', name: 'Doodh Patti Chai', description: 'Made with fresh farm milk — the chai that completes every breakfast.', price: 80, tags: ['popular'] },
  { category: 'deals', name: 'Halwa Puri Nashta Platter', description: 'Halwa + Puri + Chana + Aloo Bhaji + Lassi — the complete Chattha\'s breakfast experience.', price: 650, tags: ['bestseller', 'popular'] },
  { category: 'deals', name: 'Family Karahi Deal', description: 'Full Mutton Karahi + 4 Naans + Salad + Drinks. Feeds 4 people generously.', price: 3500, tags: ['popular'] },
  { category: 'deals', name: 'Premium BBQ Platter', description: 'Mixed BBQ + Biryani + Naans + Raita + Drinks. The full BBQ evening experience.', price: 4200, tags: ['popular'] },
];

let sql = `
-- Reset all tables with cascade to handle foreign keys
TRUNCATE TABLE order_items CASCADE;
TRUNCATE TABLE orders CASCADE;
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;
TRUNCATE TABLE menu_items CASCADE;
TRUNCATE TABLE categories CASCADE;

`;

sql += `INSERT INTO categories (id, name, slug, is_active, display_order) VALUES\n`;
MENU_CATEGORIES.forEach((cat, index) => {
  const slug = cat.label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  sql += `('${cat.uuid}', '${cat.label}', '${slug}', true, ${index})${index === MENU_CATEGORIES.length - 1 ? ';' : ','}\n`;
});

sql += `\nINSERT INTO menu_items (name, slug, description, price, category_id, is_available, is_featured, sort_order, badge, variants, addons, dietary_flags, track_inventory, stock_quantity) VALUES\n`;

const seenSlugs = new Set();
MENU_ITEMS.forEach((item, index) => {
  const categoryUuid = MENU_CATEGORIES.find(c => c.id === item.category).uuid;
  let slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  if (seenSlugs.has(slug)) {
    slug = `${slug}-${item.category}`;
  }
  seenSlugs.add(slug);
  
  const badge = item.tags.length > 0 ? (['bestseller', 'new', 'spicy', 'popular'].includes(item.tags[0]) ? item.tags[0] : null) : null;
  
  sql += `('${item.name.replace(/'/g, "''")}', '${slug}', '${item.description.replace(/'/g, "''")}', ${item.price}, '${categoryUuid}', true, ${item.tags.includes('signature')}, ${index}, ${badge ? `'${badge}'` : 'NULL'}, '[]', '[]', '[]', false, 0)${index === MENU_ITEMS.length - 1 ? ';' : ','}\n`;
});

console.log(sql);
