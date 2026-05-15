'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

const ORDER_STATUS_FLOW = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];

export async function updateOrderStatus(orderId: string, newStatus: string) {
  const supabase = createClient();
  
  // 1. Update order status
  const { error: updateError } = await supabase
    .from('orders')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', orderId);

  if (updateError) return { error: updateError.message };

  // 1.5 Handle Inventory if confirmed
  if (newStatus === 'confirmed') {
    const { data: items } = await supabase
      .from('order_items')
      .select('menu_item_id, quantity')
      .eq('order_id', orderId);

    if (items) {
      for (const item of items) {
        // We use a custom RPC to handle conditional decrement and availability check
        await supabase.rpc('decrement_inventory', { 
          item_uuid: item.menu_item_id, 
          qty: item.quantity 
        });
      }
    }
  }

  // 2. Handle Loyalty Points if delivered
  if (newStatus === 'delivered') {
    const { data: order } = await supabase
      .from('orders')
      .select('user_id, total')
      .eq('id', orderId)
      .single();

    if (order && order.user_id) {
      const pointsEarned = Math.floor(Number(order.total) / 100);
      
      if (pointsEarned > 0) {
        // Increment user's points
        await supabase.rpc('increment_loyalty_points', { 
          user_uuid: order.user_id, 
          points: pointsEarned 
        });

        // Log transaction
        await supabase.from('loyalty_transactions').insert({
          user_id: order.user_id,
          order_id: orderId,
          points_change: pointsEarned,
          description: `Earned from Order #${orderId.slice(0, 8)}`
        });
      }
    }
  }

  revalidatePath('/admin/orders');
  return { success: true };
}


export async function cancelOrder(orderId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from('orders')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', orderId);

  if (error) return { error: error.message };

  revalidatePath('/admin/orders');
  return { success: true };
}

export async function updateOrderTracking(orderId: string, data: { estimated_delivery_at?: string, rider_info?: any }) {
  const supabase = createClient();
  const { error } = await supabase
    .from('orders')
    .update({ 
      ...data, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', orderId);

  if (error) return { error: error.message };

  revalidatePath('/admin/orders');
  revalidatePath(`/order/track/${orderId}`);
  return { success: true };
}

export async function updateOrderDeliveryFee(orderId: string, fee: number) {
  const supabase = createClient();
  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('subtotal, discount_amount')
    .eq('id', orderId)
    .single();

  if (fetchError || !order) return { error: fetchError?.message || 'Order not found' };

  const newTotal = Number(order.subtotal || 0) - Number(order.discount_amount || 0) + fee;

  const { error: updateError } = await supabase
    .from('orders')
    .update({ 
      delivery_fee: fee,
      total: newTotal,
      updated_at: new Date().toISOString() 
    })
    .eq('id', orderId);

  if (updateError) return { error: updateError.message };

  revalidatePath('/admin/orders');
  return { success: true };
}

export async function deleteOrder(orderId: string) {
  const supabase = createClient();
  
  // Since we don't have cascade delete yet, we delete items first
  const { error: itemsError } = await supabase
    .from('order_items')
    .delete()
    .eq('order_id', orderId);
    
  if (itemsError) return { error: itemsError.message };

  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', orderId);

  if (error) return { error: error.message };

  revalidatePath('/admin/orders');
  return { success: true };
}

