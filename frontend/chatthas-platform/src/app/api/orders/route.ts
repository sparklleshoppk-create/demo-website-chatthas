import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const body = await request.json();
    const { formData, cartItems, cartTotal, deliveryFee, tax, discount, grandTotal } = body;

    // 1. Create the order
    const orderNumber = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Validate branch_id as UUID or null
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(formData.branch_id);
    const branchId = isUUID ? formData.branch_id : null;
    const branchInfo = !isUUID && formData.branch_id ? `| Branch: ${formData.branch_id}` : '';

    // Map payment method to allowed DB values (cod, card) to avoid check constraint violation
    const actualPaymentMethod = formData.paymentMethod || 'cod';
    const dbPaymentMethod = ['cod', 'card'].includes(actualPaymentMethod) ? actualPaymentMethod : 'cod';
    const paymentInfo = actualPaymentMethod !== dbPaymentMethod ? `| Payment: ${actualPaymentMethod}` : '';

    // Build delivery instructions with coordinates and plus code
    const deliveryParts: string[] = [];
    if (formData.delivery_lat && formData.delivery_lng) {
      deliveryParts.push(`Coords: ${formData.delivery_lat}, ${formData.delivery_lng}`);
    }
    if (formData.delivery_plus_code) {
      deliveryParts.push(`Plus Code: ${formData.delivery_plus_code}`);
    }
    if (formData.delivery_instructions) {
      deliveryParts.push(formData.delivery_instructions);
    }
    const deliveryInstructions = deliveryParts.length > 0 ? deliveryParts.join(' | ') : null;

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          order_number: orderNumber,
          status: 'pending',
          type: formData.deliveryMethod,
          subtotal: cartTotal,
          delivery_fee: deliveryFee,
          discount_amount: discount,
          total: grandTotal,
          tax_amount: tax || 0,
          payment_method: dbPaymentMethod,
          payment_status: 'pending',
          delivery_address: formData.address || null,
          delivery_instructions: deliveryInstructions,
          customer_notes: `Name: ${formData.name} | Phone: ${formData.phone}${formData.email ? ' | Email: ' + formData.email : ''} ${branchInfo} ${paymentInfo} ${formData.notes ? '| Notes: ' + formData.notes : ''}`,
          branch_id: branchId,
        }
      ])
      .select()
      .single();

    if (orderError) {
      console.error('Order Error:', orderError);
      return NextResponse.json({ error: orderError.message }, { status: 400, headers: corsHeaders });
    }

    // 2. Insert items
    if (order) {
      const orderItems = cartItems.map((item: any) => {
        const unitPrice = typeof item.price === 'string' 
          ? parseInt(item.price.replace(/[^0-9]/g, ''), 10) || 0 
          : item.price;

        return {
          order_id: order.id,
          menu_item_id: item.id, 
          quantity: item.quantity,
          unit_price: unitPrice,
          line_total: unitPrice * item.quantity,
          item_name: item.name
        };
      });

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Order Items Error (Non-Fatal):', itemsError);
      }
    }

    return NextResponse.json({ 
      success: true, 
      orderId: order.id, 
      orderNumber 
    }, {
      headers: corsHeaders
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers: corsHeaders });
  }
}

// Add CORS headers for the frontend (Vite runs on 5173 typically)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}
