import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;



const MENU_CATEGORIES = [
  { id: 'nashta', label: 'Nashta (Breakfast)', icon: '🌅' },
  { id: 'karahi', label: 'Karahi & Handi', icon: '🫕' },
  { id: 'biryani', label: 'Biryani & Rice', icon: '🍛' },
  { id: 'nihari', label: 'Nihari & Paye', icon: '🥘' },
  { id: 'bbq', label: 'BBQ', icon: '🔥' },
  { id: 'breads', label: 'Breads', icon: '🫓' },
  { id: 'desserts', label: 'Desserts', icon: '🍮' },
  { id: 'drinks', label: 'Beverages', icon: '🥛' },
  { id: 'deals', label: 'Deals & Platters', icon: '🎁' },
];

const MENU_ITEMS = [
  { id: 1, category: 'nashta', name: 'Halwa Puri Platter', nameUrdu: 'حلوہ پوری', description: 'Suji halwa, crispy fried puri, Lahori chana & aloo bhaji. Islamabad\'s most celebrated breakfast.', price: 'Rs. 450', tags: ['bestseller', 'signature'], spice: 1, image: null },
  { id: 2, category: 'nashta', name: 'Lahori Chana', nameUrdu: 'لاہوری چنا', description: 'Richly spiced chickpeas in the authentic Lahori tradition — the best in Islamabad.', price: 'Rs. 180', tags: ['signature', 'popular'], spice: 2, image: null },
  { id: 3, category: 'nashta', name: 'Whole Wheat Tandoori Paratha', nameUrdu: 'تندوری پراٹھا', description: 'Made with organic desi ghee — the signature paratha that made DAWN stop and write about us.', price: 'Rs. 80', tags: ['signature'], spice: 0, image: null },
  { id: 4, category: 'nashta', name: 'Daal Chana with Paratha', nameUrdu: 'دال چنہ پراٹھا', description: 'Slow-cooked desi ghee daal paired with our legendary whole wheat paratha.', price: 'Rs. 250', tags: ['popular', 'bestseller'], spice: 1, image: null },
  { id: 5, category: 'nashta', name: 'Cheese Omelette', nameUrdu: 'چیز آملیٹ', description: '"Next level" as our customers say — fresh farm eggs with melted cheese, cooked to perfection.', price: 'Rs. 220', tags: ['popular'], spice: 0, image: null },
  { id: 6, category: 'nashta', name: 'Aloo Anda', nameUrdu: 'آلو انڈا', description: 'A classic Pakistani breakfast staple — spiced potato with egg, cooked in desi ghee.', price: 'Rs. 180', tags: [], spice: 1, image: null },
  { id: 7, category: 'karahi', name: 'Desi Ghee Mutton Karahi', nameUrdu: 'دیسی گھی مٹن کڑاہی', description: 'Our crowning glory — tender mutton, cooked in organic farm-sourced desi ghee in a cast iron wok.', price: 'Rs. 1,400 – 2,100', tags: ['signature', 'bestseller'], spice: 3, image: null },
  { id: 8, category: 'karahi', name: 'Chicken Koyla Special Karahi', nameUrdu: 'کوئلہ چکن کڑاہی', description: 'Char-grilled coal-infused chicken karahi with an irresistible smoky flavour.', price: 'Rs. 950', tags: ['popular'], spice: 2, image: null },
  { id: 9, category: 'karahi', name: 'White Chicken Karahi', nameUrdu: 'وائٹ چکن کڑاہی', description: '"Was fireee!" — creamy, mellow white karahi that breaks all expectations.', price: 'Rs. 950', tags: ['popular'], spice: 1, image: null },
  { id: 10, category: 'karahi', name: 'Chicken Makhani Handi', nameUrdu: 'مکھنی ہانڈی', description: 'Buttery, rich makhani handi cooked slow in a clay pot. Soul food at its finest.', price: 'Rs. 850', tags: ['popular'], spice: 1, image: null },
  { id: 11, category: 'karahi', name: 'Mutton Brain Masala (Maghaz)', nameUrdu: 'مغز مصالحہ', description: '"Best mutton brain masala in Islamabad" — spiced, delicate and unforgettable.', price: 'Rs. 750', tags: ['signature'], spice: 2, image: null },
  { id: 12, category: 'karahi', name: 'Daal Makhni', nameUrdu: 'دال مکھنی', description: 'DAWN called it "the best in town" — slow-cooked black lentils with a buttery finish.', price: 'Rs. 480', tags: ['popular'], spice: 1, image: null },
  { id: 13, category: 'karahi', name: 'Palak Paneer', nameUrdu: 'پالک پنیر', description: 'Fresh spinach and cottage cheese in a fragrant masala. A vegetarian masterpiece.', price: 'Rs. 550', tags: ['popular'], spice: 1, image: null },
  { id: 14, category: 'biryani', name: "Chattha's Special Chicken Biryani", nameUrdu: 'چٹھا سپیشل چکن بریانی', description: 'Mint, dried plum, lemon zest, and farm-grown rice. "One of the best in Islamabad" — Foodpanda 2026.', price: 'Rs. 480', tags: ['signature', 'bestseller'], spice: 2, image: null },
  { id: 15, category: 'biryani', name: 'Mutton Biryani', nameUrdu: 'مٹن بریانی', description: 'Slow-cooked mutton biryani on farm-sourced rice. Slow-cooked, never rushed.', price: 'Rs. 620', tags: ['popular'], spice: 2, image: null },
  { id: 16, category: 'nihari', name: 'Beef Nalli Nihari', nameUrdu: 'بیف نلی نہاری', description: 'Pure bone-marrow nihari — "scrumptious" per our Foodpanda reviewers. Slow-cooked overnight.', price: 'Rs. 650', tags: ['signature', 'bestseller'], spice: 3, image: null },
  { id: 17, category: 'nihari', name: 'Beef Nihari (Full)', nameUrdu: 'بیف نہاری', description: 'Classic slow-cooked beef nihari in traditional spices. Rich, deep, and legendary.', price: 'Rs. 590', tags: ['popular'], spice: 3, image: null },
  { id: 18, category: 'nihari', name: 'Beef Nihari (Half)', nameUrdu: 'بیف نہاری نصف', description: 'Half portion of our signature beef nihari — perfect to pair with Roghni Naan.', price: 'Rs. 300', tags: [], spice: 3, image: null },
  { id: 19, category: 'nihari', name: 'Mutton Paye', nameUrdu: 'مٹن پائے', description: 'Traditional slow-cooked goat trotters in aromatic spices — a winter morning ritual.', price: 'Rs. 490', tags: [], spice: 2, image: null },
  { id: 20, category: 'nihari', name: 'Haleem', nameUrdu: 'حلیم', description: 'Rich slow-cooked lentil and meat stew — the definition of Pakistani comfort food.', price: 'Rs. 420', tags: ['popular'], spice: 2, image: null },
  { id: 21, category: 'bbq', name: 'Beef Seekh Kebab', nameUrdu: 'بیف سیخ کباب', description: 'Juicy spiced beef mince on skewers, char-grilled over open flame. Pair with raita.', price: 'Rs. 380 – 580', tags: ['popular'], spice: 2, image: null },
  { id: 22, category: 'bbq', name: 'Chicken Rajasthani Boti', nameUrdu: 'راجستھانی بوٹی', description: 'Tender chicken marinated in Rajasthani spices and char-grilled to perfection.', price: 'Rs. 750', tags: ['popular'], spice: 2, image: null },
  { id: 23, category: 'bbq', name: 'Malai Boti', nameUrdu: 'ملائی بوٹی', description: 'Creamy marinated chicken pieces grilled on skewers — a crowd favourite.', price: 'Rs. 750', tags: ['bestseller'], spice: 1, image: null },
  { id: 24, category: 'bbq', name: 'Mixed BBQ Platter', nameUrdu: 'مکسڈ بی بی کیو', description: 'A grand spread of seekh kebab, malai boti, and rajasthani boti — for the whole family.', price: 'Rs. 1,800', tags: ['popular'], spice: 2, image: null },
  { id: 25, category: 'breads', name: 'Whole Wheat Tandoori Paratha', nameUrdu: 'تندوری پراٹھا', description: 'Our signature — baked in the tandoor with organic desi ghee.', price: 'Rs. 80', tags: ['signature'], spice: 0, image: null },
  { id: 26, category: 'breads', name: 'Roghni Naan', nameUrdu: 'روغنی نان', description: '"Scrumptious" — buttered soft naan fresh from the tandoor.', price: 'Rs. 60', tags: ['popular'], spice: 0, image: null },
  { id: 27, category: 'breads', name: 'Kulcha', nameUrdu: 'کلچہ', description: 'Fluffy leavened bread — best with halwa puri or nihari.', price: 'Rs. 50', tags: [], spice: 0, image: null },
  { id: 28, category: 'breads', name: 'Tandoori Roti', nameUrdu: 'تندوری روٹی', description: 'Classic tandoor-baked roti — the everyday essential.', price: 'Rs. 30', tags: [], spice: 0, image: null },
  { id: 29, category: 'desserts', name: "Founder's Sugarcane Brownie", nameUrdu: 'گنے کا براؤنی', description: '"I made this myself — using sugarcane instead of crystal sugar to give it a local flavor." — Waqar Chattha', price: 'Rs. 280', tags: ['signature', 'new'], spice: 0, image: null },
  { id: 30, category: 'desserts', name: 'Kheer', nameUrdu: 'کھیر', description: 'Traditional rice pudding made with farm-fresh milk. Slow-cooked, generously sweet.', price: 'Rs. 180', tags: ['popular'], spice: 0, image: null },
  { id: 31, category: 'drinks', name: 'Namkeen Lassi', nameUrdu: 'نمکین لسی', description: 'Salted lassi served in traditional stainless steel glass. "Perfectly chilled" — every time.', price: 'Rs. 150', tags: ['signature', 'bestseller'], spice: 0, image: null },
  { id: 32, category: 'drinks', name: 'Meethi Lassi', nameUrdu: 'میٹھی لسی', description: 'Sweet lassi made with farm-fresh pure milk. Creamy, cold, and deeply satisfying.', price: 'Rs. 150', tags: ['popular'], spice: 0, image: null },
  { id: 33, category: 'drinks', name: 'Fresh Juice', nameUrdu: 'تازہ جوس', description: '"Another level" — freshly pressed seasonal fruit juices. No concentrates, ever.', price: 'Rs. 180', tags: ['popular'], spice: 0, image: null },
  { id: 34, category: 'drinks', name: 'Mint Margarita', nameUrdu: 'منٹ مارگریٹا', description: 'Refreshing non-alcoholic minty cooler — the perfect companion to BBQ.', price: 'Rs. 200', tags: ['popular'], spice: 0, image: null },
  { id: 35, category: 'drinks', name: 'Doodh Patti Chai', nameUrdu: 'دودھ پتی چائے', description: 'Made with fresh farm milk — the chai that completes every breakfast.', price: 'Rs. 80', tags: ['popular'], spice: 0, image: null },
  { id: 36, category: 'deals', name: 'Halwa Puri Nashta Platter', nameUrdu: 'ناشتہ پلیٹر', description: 'Halwa + Puri + Chana + Aloo Bhaji + Lassi — the complete Chattha\'s breakfast experience.', price: 'Rs. 650', tags: ['bestseller', 'popular'], spice: 1, image: null },
  { id: 37, category: 'deals', name: 'Family Karahi Deal', nameUrdu: 'فیملی کڑاہی ڈیل', description: 'Full Mutton Karahi + 4 Naans + Salad + Drinks. Feeds 4 people generously.', price: 'Rs. 3,500', tags: ['popular'], spice: 2, image: null },
  { id: 38, category: 'deals', name: 'Premium BBQ Platter', nameUrdu: 'پریمیم بی بی کیو پلیٹر', description: 'Mixed BBQ + Biryani + Naans + Raita + Drinks. The full BBQ evening experience.', price: 'Rs. 4,200', tags: ['popular'], spice: 2, image: null },
];

function parsePrice(priceStr: string) {
  const match = priceStr.match(/\d+/);
  return match ? parseInt(match[0]) : 0;
}

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // 0. Clear existing data
    await supabase.from('menu_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // 1. Seed Categories
    const categoriesToInsert = MENU_CATEGORIES.map((cat, index) => ({
      name: cat.label,
      slug: cat.label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      is_active: true,
      display_order: index
    }));

    const { data: insertedCategories, error: catError } = await supabase
      .from('categories')
      .insert(categoriesToInsert)
      .select();

    if (catError) throw catError;

    // 2. Map Category labels to IDs
    const categoryMap = new Map();
    insertedCategories.forEach(cat => {
      const originalCat = MENU_CATEGORIES.find(c => c.label === cat.name);
      if (originalCat) {
        categoryMap.set(originalCat.id, cat.id);
      }
    });

    // 3. Seed Menu Items
    const itemsToInsert = MENU_ITEMS.map((item, index) => ({
      name: item.name,
      slug: `${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${item.category}-${index}`,
      description: item.description,
      price: parsePrice(item.price),
      category_id: categoryMap.get(item.category),
      is_available: true,
      is_featured: item.tags.includes('signature') || item.tags.includes('bestseller'),
      sort_order: index,
      badge: item.tags.length > 0 ? (['bestseller', 'new', 'spicy', 'popular'].includes(item.tags[0]) ? item.tags[0] : null) : null,
      image_url: null,
      dietary_flags: [],
      variants: [],
      addons: [],
      track_inventory: false,
      stock_quantity: 0
    }));

    const { error: itemsError } = await supabase
      .from('menu_items')
      .insert(itemsToInsert);

    if (itemsError) throw itemsError;

    return NextResponse.json({ success: true, message: 'Database seeded successfully!' });
  } catch (error: any) {
    console.error('Seed Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
