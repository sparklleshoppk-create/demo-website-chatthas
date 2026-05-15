'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createOrder(customerData: any, cartItems: any[]) {
  const supabase = createClient();

  try {
    // 1. Create the order
    const orderNumber = `CH-${Math.floor(100000 + Math.random() * 900000)}`;
    const { data: { user } } = await supabase.auth.getUser();
    
    let validUserId = null;
    if (user) {
      // Verify if user exists in public.users table to satisfy foreign key
      const { data: userExists } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();
      
      if (userExists) {
        validUserId = user.id;
      }
    }
    
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: validUserId,
        branch_id: customerData.branchId,
        delivery_address: customerData.address,
        customer_notes: `Phone: ${customerData.phone} | Name: ${customerData.name}`,
        total: customerData.total,
        subtotal: customerData.total - (customerData.deliveryFee || 0) + (customerData.promoDiscount || 0) - (customerData.taxAmount || 0),
        delivery_fee: customerData.deliveryFee || 0,
        discount_amount: customerData.promoDiscount || 0,
        promo_code: customerData.promoCode || null,
        tax_amount: customerData.taxAmount || 0,
        delivery_instructions: customerData.deliveryInstructions || null,
        status: 'pending',
        type: 'delivery',
        payment_method: 'cod',
        payment_status: 'pending'
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Deduct points if used
    if (customerData.usePoints && validUserId) {
      const { data: profile } = await supabase.from('users').select('loyalty_points').eq('id', validUserId).single();
      if (profile && profile.loyalty_points > 0) {
        const pointsToDeduct = profile.loyalty_points;
        await supabase.rpc('decrement_loyalty_points', { 
          user_uuid: validUserId, 
          points: pointsToDeduct 
        });

        await supabase.from('loyalty_transactions').insert({
          user_id: validUserId,
          order_id: order.id,
          points_change: -pointsToDeduct,
          description: `Redeemed points for Order #${orderNumber}`
        });
      }
    }


    // 2. Add order items
    const orderItems = cartItems.map(item => ({
      order_id: order.id,
      menu_item_id: item.menu_item_id,
      item_name: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      line_total: item.price * item.quantity,
      variant_label: item.variant_label || null,
      addons: item.addons || []
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    if (itemsError) throw itemsError;

    revalidatePath('/admin', 'layout');
    revalidatePath('/admin/orders');
    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error('Order Error:', error);
    return { error: error.message || 'Something went wrong while placing your order.' };
  }
}
