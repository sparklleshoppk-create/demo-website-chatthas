import { createClient } from '@/utils/supabase/server';
import PaymentGatewayConfig from './PaymentGatewayConfig';

export default async function PaymentsPage() {
  const supabase = createClient();
  
  const { data: settings } = await supabase
    .from('website_settings')
    .select('*')
    .eq('group', 'payments')
    .order('key');

  return (
    <div className="space-y-8">
      <div className="bg-amber-500/5 border border-amber-500/20 p-5 rounded-sm">
        <p className="text-sm font-bold tracking-widest uppercase text-amber-400 leading-relaxed">
          🔒 Security — Secret keys (passwords, API secrets) are encrypted at rest and never exposed to the public-facing API. 
          Only the gateway name and enabled status are visible to the frontend.
        </p>
      </div>

      <PaymentGatewayConfig existingSettings={settings || []} />
    </div>
  );
}
