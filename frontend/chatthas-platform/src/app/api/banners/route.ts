import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data: banners, error } = await supabase
      .from('homepage_sections')
      .select('*')
      .eq('section_type', 'banner')
      .eq('is_active', true);

    if (error) throw error;

    // Graceful client-side sort to be fully independent of database sort_order column presence
    const sortedBanners = (banners || []).sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));

    // Fetch configurable banner swap duration
    const { data: durationSetting } = await supabase
      .from('website_settings')
      .select('value')
      .eq('key', 'banner_swap_duration_ms')
      .limit(1)
      .single();

    const swapDuration = durationSetting ? parseInt(durationSetting.value) : 7000;

    return NextResponse.json({ banners: sortedBanners, swap_duration_ms: swapDuration }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error: any) {
    console.error('Banners API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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
