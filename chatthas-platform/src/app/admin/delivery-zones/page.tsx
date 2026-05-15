import { createClient } from '@/utils/supabase/server';
import DeliveryZonesClient from './DeliveryZonesClient';

export default async function DeliveryZonesPage() {
  const supabase = createClient();

  const { data: zones } = await supabase
    .from('delivery_zones')
    .select('*, branches(name)')
    .order('branch_id')
    .order('min_distance_km');

  const { data: branches } = await supabase
    .from('branches')
    .select('id, name')
    .order('display_order');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-cream tracking-tight">Delivery <span className="gold-text italic">Zones</span></h2>
          <p className="text-sm text-cream/50 mt-1">Define delivery fees and estimated times by distance per branch.</p>
        </div>
      </div>

      <DeliveryZonesClient initialZones={zones || []} branches={branches || []} />
    </div>
  );
}
