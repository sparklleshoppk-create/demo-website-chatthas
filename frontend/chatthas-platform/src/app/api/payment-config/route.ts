import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data: settings } = await supabase
      .from('website_settings')
      .select('key, value, is_secret')
      .eq('group', 'payments');

    // Build a list of enabled gateways (NEVER expose secret keys)
    const gateways: { id: string; name: string; enabled: boolean; type: string }[] = [];
    
    const gatewayMap: Record<string, string> = {
      jazzcash: 'JazzCash',
      easypaisa: 'EasyPaisa',
      stripe: 'Credit / Debit Card',
      other: 'Other Payment',
    };

    if (settings) {
      // Find all enabled gateways
      const enabledKeys = settings.filter(s => s.key.endsWith('_enabled') && s.value === 'true');
      
      for (const enabledSetting of enabledKeys) {
        // Extract gateway ID from key like "gateway_jazzcash_enabled"
        const parts = enabledSetting.key.split('_');
        const gatewayId = parts.slice(1, -1).join('_'); // handles "custom_123" ids
        
        // Check if required credentials are filled (without exposing them)
        const hasCredentials = settings.some(s => 
          s.key.startsWith(`gateway_${gatewayId}_`) && 
          !s.key.endsWith('_enabled') && 
          s.value && 
          s.value.trim() !== ''
        );

        // Get custom name if it's a custom/other gateway
        const nameSetting = settings.find(s => s.key === `gateway_${gatewayId}_gateway_name`);
        
        let displayName = gatewayMap[gatewayId] || nameSetting?.value || gatewayId;
        let type = gatewayId;

        // Determine type for frontend
        if (gatewayId.startsWith('custom_')) type = 'custom';

        gateways.push({
          id: gatewayId,
          name: displayName,
          enabled: hasCredentials, // Only truly enabled if credentials exist
          type,
        });
      }
    }

    // COD is always available
    gateways.unshift({
      id: 'cod',
      name: 'Cash on Delivery',
      enabled: true,
      type: 'cod',
    });

    return NextResponse.json({ gateways }, { headers: corsHeaders });
  } catch (error: any) {
    console.error('Payment config error:', error);
    return NextResponse.json({ gateways: [{ id: 'cod', name: 'Cash on Delivery', enabled: true, type: 'cod' }] }, { headers: corsHeaders });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
