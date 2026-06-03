/**
 * Gallery Data — Curated visual showcase of Chattha's
 * 
 * Static fallback gallery items used when database gallery_items table is empty.
 * These provide a rich, complete gallery experience out of the box.
 */

export interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image_url: string;
  type: 'image' | 'video';
  video_id?: string;
  span_class?: string;
  display_order: number;
}

export const GALLERY_CATEGORIES = [
  { id: 'all', label: 'All Media', icon: '✦' },
  { id: 'food', label: 'Our Food', icon: '🍽️' },
  { id: 'ambiance', label: 'Ambiance', icon: '✨' },
  { id: 'kitchen', label: 'The Kitchen', icon: '🔥' },
  { id: 'people', label: 'Our People', icon: '👨‍🍳' },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  // ── FOOD ──
  {
    id: 1,
    title: 'Desi Ghee Mutton Karahi',
    category: 'food',
    image_url: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=800&q=80&auto=format',
    type: 'image',
    span_class: 'md:col-span-2 md:row-span-2',
    display_order: 1,
  },
  {
    id: 2,
    title: 'Halwa Puri Breakfast',
    category: 'food',
    image_url: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=800&q=80&auto=format',
    type: 'image',
    span_class: '',
    display_order: 2,
  },
  {
    id: 3,
    title: 'Special Chicken Biryani',
    category: 'food',
    image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80&auto=format',
    type: 'image',
    span_class: '',
    display_order: 3,
  },
  {
    id: 4,
    title: 'Seekh Kebab Platter',
    category: 'food',
    image_url: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80&auto=format',
    type: 'image',
    span_class: '',
    display_order: 4,
  },
  {
    id: 5,
    title: 'Daal Makhni',
    category: 'food',
    image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80&auto=format',
    type: 'image',
    span_class: '',
    display_order: 5,
  },
  {
    id: 6,
    title: 'Fresh Tandoori Naan',
    category: 'food',
    image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80&auto=format',
    type: 'image',
    span_class: 'md:col-span-2',
    display_order: 6,
  },
  {
    id: 7,
    title: 'Palak Paneer',
    category: 'food',
    image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80&auto=format',
    type: 'image',
    span_class: '',
    display_order: 7,
  },
  {
    id: 8,
    title: 'Malai Boti BBQ',
    category: 'food',
    image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80&auto=format',
    type: 'image',
    span_class: '',
    display_order: 8,
  },
  {
    id: 9,
    title: 'Creamy Lassi',
    category: 'food',
    image_url: 'https://images.unsplash.com/photo-1544252890-c3e95e867495?w=600&q=80&auto=format',
    type: 'image',
    span_class: '',
    display_order: 9,
  },
  {
    id: 10,
    title: 'Mixed BBQ Platter',
    category: 'food',
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80&auto=format',
    type: 'image',
    span_class: 'md:col-span-2',
    display_order: 10,
  },
  {
    id: 11,
    title: 'Chicken Makhani Handi',
    category: 'food',
    image_url: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&q=80&auto=format',
    type: 'image',
    span_class: '',
    display_order: 11,
  },
  {
    id: 12,
    title: 'Cheese Omelette',
    category: 'food',
    image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80&auto=format',
    type: 'image',
    span_class: '',
    display_order: 12,
  },

  // ── AMBIANCE ──
  {
    id: 13,
    title: 'The Dining Hall',
    category: 'ambiance',
    image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80&auto=format',
    type: 'image',
    span_class: 'md:col-span-2 md:row-span-2',
    display_order: 13,
  },
  {
    id: 14,
    title: 'Warm Evening Glow',
    category: 'ambiance',
    image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80&auto=format',
    type: 'image',
    span_class: '',
    display_order: 14,
  },
  {
    id: 15,
    title: 'Rooftop Seating',
    category: 'ambiance',
    image_url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80&auto=format',
    type: 'image',
    span_class: '',
    display_order: 15,
  },
  {
    id: 16,
    title: 'Golden Hour at F-10',
    category: 'ambiance',
    image_url: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&q=80&auto=format',
    type: 'image',
    span_class: '',
    display_order: 16,
  },
  {
    id: 17,
    title: 'Table Setting',
    category: 'ambiance',
    image_url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=600&q=80&auto=format',
    type: 'image',
    span_class: '',
    display_order: 17,
  },
  {
    id: 18,
    title: 'Garden Area',
    category: 'ambiance',
    image_url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80&auto=format',
    type: 'image',
    span_class: 'md:col-span-2',
    display_order: 18,
  },

  // ── KITCHEN ──
  {
    id: 19,
    title: 'The Tandoor',
    category: 'kitchen',
    image_url: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800&q=80&auto=format',
    type: 'image',
    span_class: 'md:col-span-2',
    display_order: 19,
  },
  {
    id: 20,
    title: 'Live Cooking Station',
    category: 'kitchen',
    image_url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&q=80&auto=format',
    type: 'image',
    span_class: '',
    display_order: 20,
  },
  {
    id: 21,
    title: 'Fresh Spices',
    category: 'kitchen',
    image_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80&auto=format',
    type: 'image',
    span_class: '',
    display_order: 21,
  },
  {
    id: 22,
    title: 'The Karahi Station',
    category: 'kitchen',
    image_url: 'https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?w=600&q=80&auto=format',
    type: 'image',
    span_class: '',
    display_order: 22,
  },
  {
    id: 23,
    title: 'Farm Fresh Ingredients',
    category: 'kitchen',
    image_url: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600&q=80&auto=format',
    type: 'image',
    span_class: '',
    display_order: 23,
  },

  // ── PEOPLE ──
  {
    id: 24,
    title: 'Family Dining',
    category: 'people',
    image_url: 'https://images.unsplash.com/photo-1529543544282-b310795e6221?w=800&q=80&auto=format',
    type: 'image',
    span_class: 'md:col-span-2',
    display_order: 24,
  },
  {
    id: 25,
    title: 'Weekend Nashta Crowd',
    category: 'people',
    image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80&auto=format',
    type: 'image',
    span_class: '',
    display_order: 25,
  },
  {
    id: 26,
    title: 'Our Team',
    category: 'people',
    image_url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&q=80&auto=format',
    type: 'image',
    span_class: '',
    display_order: 26,
  },
  {
    id: 27,
    title: 'The Chef at Work',
    category: 'people',
    image_url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&q=80&auto=format',
    type: 'image',
    span_class: '',
    display_order: 27,
  },
  {
    id: 28,
    title: 'Happy Customers',
    category: 'people',
    image_url: 'https://images.unsplash.com/photo-1529543544282-b310795e6221?w=600&q=80&auto=format',
    type: 'image',
    span_class: '',
    display_order: 28,
  },
];
