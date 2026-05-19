import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // 1. Fetch Categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, name, display_order')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (catError) throw catError;

    // 2. Fetch Menu Items
    const { data: items, error: itemsError } = await supabase
      .from('menu_items')
      .select('*')
      .eq('is_available', true)
      .order('sort_order', { ascending: true });

    if (itemsError) throw itemsError;

    // Transform categories for frontend
    const transformedCategories = categories.map(cat => ({
      id: cat.name.toLowerCase().split(' ')[0].replace(/[^a-z]/g, ''),
      db_id: cat.id,
      label: cat.name,
      // Icon mapping for frontend icons
      icon: cat.name.includes('Nashta') ? '🌅' : 
            cat.name.includes('Karahi') ? '🫕' : 
            cat.name.includes('Biryani') ? '🍛' : 
            cat.name.includes('Nihari') ? '🥘' : 
            cat.name.includes('BBQ') ? '🔥' : 
            cat.name.includes('Bread') ? '🫓' : 
            cat.name.includes('Dessert') ? '🍮' : 
            cat.name.includes('Beverage') ? '🥛' : 
            cat.name.includes('Deals') ? '🎁' : '🍽️'
    }));

    return NextResponse.json({ 
      categories: transformedCategories,
      items: items.map(item => ({
        ...item,
        category: transformedCategories.find(c => c.db_id === item.category_id)?.id || 'nashta',
        price: `Rs. ${item.price.toLocaleString()}`,
        tags: [item.badge].filter(Boolean)
      }))
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error: any) {
    console.error('Menu API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
