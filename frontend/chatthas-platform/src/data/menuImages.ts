/**
 * Menu Item Image Mapping
 * 
 * Curated high-quality food photography from Unsplash for each menu item.
 * These serve as default images when no custom image_url is set in the database.
 * Images are matched by slug or item name for reliable fallback.
 */

// Category-level hero images for section headers
export const CATEGORY_IMAGES: Record<string, string> = {
  nashta: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=800&q=80&auto=format',
  karahi: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80&auto=format',
  biryani: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80&auto=format',
  nihari: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=800&q=80&auto=format',
  bbq: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80&auto=format',
  breads: 'https://images.unsplash.com/photo-1586444248879-bc604cbd555a?w=800&q=80&auto=format',
  desserts: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80&auto=format',
  drinks: 'https://images.unsplash.com/photo-1544252890-c3e95e867495?w=800&q=80&auto=format',
  deals: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80&auto=format',
};

// Individual menu item images mapped by slug (kebab-case of item name)
export const MENU_ITEM_IMAGES: Record<string, string> = {
  // ── NASHTA (Breakfast) ──
  'halwa-puri-platter': 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&q=80&auto=format',
  'lahori-chana': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80&auto=format',
  'whole-wheat-tandoori-paratha': 'https://images.unsplash.com/photo-1586444248879-bc604cbd555a?w=600&q=80&auto=format',
  'daal-chana-with-paratha': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80&auto=format',
  'cheese-omelette': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80&auto=format',
  'aloo-anda': 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80&auto=format',
  
  // ── KARAHI & HANDI ──
  'desi-ghee-mutton-karahi': 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=600&q=80&auto=format',
  'chicken-koyla-special-karahi': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae328?w=600&q=80&auto=format',
  'white-chicken-karahi': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80&auto=format',
  'chicken-makhani-handi': 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&q=80&auto=format',
  'mutton-brain-masala-maghaz': 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=600&q=80&auto=format',
  'daal-makhni': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80&auto=format',
  'palak-paneer': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80&auto=format',
  
  // ── BIRYANI & RICE ──
  'chatthas-special-chicken-biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80&auto=format',
  'mutton-biryani': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&q=80&auto=format',
  
  // ── NIHARI & PAYE ──
  'beef-nalli-nihari': 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=600&q=80&auto=format',
  'beef-nihari-full': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80&auto=format',
  'beef-nihari-half': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80&auto=format',
  'mutton-paye': 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=600&q=80&auto=format',
  'haleem': 'https://images.unsplash.com/photo-1606491048802-8342506d6471?w=600&q=80&auto=format',
  
  // ── BBQ ──
  'beef-seekh-kebab': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80&auto=format',
  'chicken-rajasthani-boti': 'https://images.unsplash.com/photo-1610057099443-fde6c99db9e1?w=600&q=80&auto=format',
  'malai-boti': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80&auto=format',
  'mixed-bbq-platter': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80&auto=format',
  
  // ── BREADS ──
  'tandoori-paratha': 'https://images.unsplash.com/photo-1586444248879-bc604cbd555a?w=600&q=80&auto=format',
  'roghni-naan': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80&auto=format',
  'kulcha': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80&auto=format',
  'tandoori-roti': 'https://images.unsplash.com/photo-1586444248879-bc604cbd555a?w=600&q=80&auto=format',
  
  // ── DESSERTS ──
  'founders-sugarcane-brownie': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80&auto=format',
  'kheer': 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&q=80&auto=format',
  
  // ── DRINKS ──
  'namkeen-lassi': 'https://images.unsplash.com/photo-1544252890-c3e95e867495?w=600&q=80&auto=format',
  'meethi-lassi': 'https://images.unsplash.com/photo-1544252890-c3e95e867495?w=600&q=80&auto=format',
  'fresh-juice': 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600&q=80&auto=format',
  'mint-margarita': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80&auto=format',
  'doodh-patti-chai': 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600&q=80&auto=format',
  
  // ── DEALS & PLATTERS ──
  'halwa-puri-nashta-platter': 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&q=80&auto=format',
  'family-karahi-deal': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80&auto=format',
  'premium-bbq-platter': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80&auto=format',
};

/**
 * Gets the best available image for a menu item.
 * Priority: database image_url → slug match → category fallback → generic food image
 */
export function getMenuItemImage(item: {
  image_url?: string | null;
  slug?: string;
  category_id?: string;
}): string {
  // 1. Use database image if available
  if (item.image_url) return item.image_url;
  
  // 2. Match by slug
  if (item.slug && MENU_ITEM_IMAGES[item.slug]) {
    return MENU_ITEM_IMAGES[item.slug];
  }
  
  // 3. Fallback to category image
  if (item.category_id && CATEGORY_IMAGES[item.category_id]) {
    return CATEGORY_IMAGES[item.category_id];
  }
  
  // 4. Generic food image
  return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80&auto=format';
}
