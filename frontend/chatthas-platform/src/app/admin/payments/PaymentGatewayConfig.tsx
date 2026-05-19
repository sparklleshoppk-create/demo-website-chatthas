'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveGatewayConfig } from './actions';
import { FaSave, FaPlus, FaTrash, FaCreditCard, FaMobileAlt, FaMoneyBillWave, FaGlobe, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface GatewayField {
  key: string;
  label: string;
  placeholder: string;
  type: 'text' | 'password';
  required: boolean;
  helpText?: string;
}

interface GatewayTemplate {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  fields: GatewayField[];
}

const GATEWAY_TEMPLATES: GatewayTemplate[] = [
  {
    id: 'jazzcash',
    name: 'JazzCash',
    icon: FaMobileAlt,
    color: 'text-red-500 bg-red-500/10 border-red-500/20',
    description: 'Accept payments via JazzCash Mobile Wallet & MWALLET API',
    fields: [
      { key: 'merchant_id', label: 'Merchant ID', placeholder: 'MC12345 — From JazzCash Merchant Portal', type: 'text', required: true, helpText: 'Found in JazzCash Merchant Dashboard → Settings → API Credentials' },
      { key: 'password', label: 'Password', placeholder: 'Your JazzCash API Password', type: 'password', required: true, helpText: 'The password assigned to your merchant account' },
      { key: 'integrity_salt', label: 'Integrity Salt (HashKey)', placeholder: 'a1b2c3d4e5f6... — 32-character hash key', type: 'password', required: true, helpText: 'Used to generate secure hash for transaction verification' },
      { key: 'return_url', label: 'Return URL', placeholder: 'https://yoursite.com/payment/callback/jazzcash', type: 'text', required: false, helpText: 'Auto-configured — URL where customer is redirected after payment' },
      { key: 'environment', label: 'Environment', placeholder: 'sandbox or production', type: 'text', required: true, helpText: 'Use "sandbox" for testing, "production" for live payments' },
    ]
  },
  {
    id: 'easypaisa',
    name: 'EasyPaisa',
    icon: FaMobileAlt,
    color: 'text-green-500 bg-green-500/10 border-green-500/20',
    description: 'Accept payments via EasyPaisa Mobile Wallet & OTC',
    fields: [
      { key: 'store_id', label: 'Store ID', placeholder: 'Your EasyPaisa Store ID (e.g., 12345)', type: 'text', required: true, helpText: 'From EasyPaisa Merchant Portal → Store Management' },
      { key: 'account_number', label: 'Account Number', placeholder: '03XX-XXXXXXX — Your EasyPaisa account number', type: 'text', required: true, helpText: 'The mobile number linked to your EasyPaisa merchant account' },
      { key: 'hashkey', label: 'Hash Key', placeholder: 'Your EasyPaisa Hash Key for API authentication', type: 'password', required: true, helpText: 'Provided by EasyPaisa during merchant onboarding' },
      { key: 'username', label: 'API Username', placeholder: 'Your EasyPaisa API username', type: 'text', required: false, helpText: 'Username for REST API authentication (if using hosted checkout)' },
      { key: 'password', label: 'API Password', placeholder: 'Your EasyPaisa API password', type: 'password', required: false, helpText: 'Password for REST API authentication' },
      { key: 'environment', label: 'Environment', placeholder: 'sandbox or production', type: 'text', required: true, helpText: 'Use "sandbox" for testing, "production" for live payments' },
    ]
  },
  {
    id: 'stripe',
    name: 'Credit / Debit Cards (Stripe)',
    icon: FaCreditCard,
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    description: 'Accept Visa, Mastercard, and international cards via Stripe',
    fields: [
      { key: 'publishable_key', label: 'Publishable Key', placeholder: 'pk_test_... or pk_live_... — From Stripe Dashboard', type: 'text', required: true, helpText: 'Found in Stripe Dashboard → Developers → API Keys → Publishable key' },
      { key: 'secret_key', label: 'Secret Key', placeholder: 'sk_test_... or sk_live_... — NEVER share publicly', type: 'password', required: true, helpText: 'Found in Stripe Dashboard → Developers → API Keys → Secret key' },
      { key: 'webhook_secret', label: 'Webhook Signing Secret', placeholder: 'whsec_... — For payment verification', type: 'password', required: false, helpText: 'Found in Stripe Dashboard → Developers → Webhooks → Signing secret' },
      { key: 'currency', label: 'Currency', placeholder: 'PKR', type: 'text', required: false, helpText: 'Default: PKR (Pakistani Rupee). Stripe supports 135+ currencies' },
    ]
  },
  {
    id: 'other',
    name: 'Other Gateway',
    icon: FaGlobe,
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    description: 'Connect PayFast, Safepay, PayPro, or any other payment gateway',
    fields: [
      { key: 'gateway_name', label: 'Gateway Name', placeholder: 'e.g., PayFast, Safepay, PayPro, Raast', type: 'text', required: true, helpText: 'The name of the payment gateway you are connecting' },
      { key: 'api_key', label: 'API Key / Merchant ID', placeholder: 'Your gateway API key or Merchant ID', type: 'text', required: true, helpText: 'Primary authentication credential from your gateway dashboard' },
      { key: 'api_secret', label: 'API Secret / Password', placeholder: 'Your gateway API secret key or password', type: 'password', required: true, helpText: 'Secret key for server-side API calls — never exposed publicly' },
      { key: 'api_url', label: 'API Base URL', placeholder: 'https://api.gateway.com/v1 — The gateway API endpoint', type: 'text', required: false, helpText: 'The base URL for the gateway\'s REST API' },
      { key: 'webhook_url', label: 'Webhook URL', placeholder: 'Auto-generated callback URL for this gateway', type: 'text', required: false, helpText: 'URL that the gateway calls to notify payment status changes' },
      { key: 'environment', label: 'Environment', placeholder: 'sandbox or production', type: 'text', required: true, helpText: 'Use "sandbox" for testing, "production" for live payments' },
    ]
  },
];

interface GatewayConfig {
  id: string;
  enabled: boolean;
  credentials: Record<string, string>;
  template: GatewayTemplate;
}

export default function PaymentGatewayConfig({ existingSettings }: { existingSettings: any[] }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Parse existing settings into gateway configs
  const parseExisting = () => {
    const configs: Record<string, GatewayConfig> = {};
    const loadedCustomTemplates: GatewayTemplate[] = [];

    // Find custom gateways from settings
    const customGatewayIds = new Set<string>();
    existingSettings.forEach(s => {
      if (s.key.startsWith('gateway_custom_') && s.key.endsWith('_enabled')) {
        const id = s.key.replace('gateway_', '').replace('_enabled', '');
        customGatewayIds.add(id);
      }
    });

    customGatewayIds.forEach(id => {
      loadedCustomTemplates.push({
        id,
        name: existingSettings.find(s => s.key === `gateway_${id}_gateway_name`)?.value || 'Custom Gateway',
        icon: FaGlobe,
        color: 'text-teal-500 bg-teal-500/10 border-teal-500/20',
        description: 'Custom payment gateway connection',
        fields: [
          { key: 'gateway_name', label: 'Gateway Name', placeholder: 'Enter the gateway name', type: 'text', required: true },
          { key: 'api_key', label: 'API Key / Merchant ID', placeholder: 'Primary authentication credential', type: 'text', required: true },
          { key: 'api_secret', label: 'API Secret / Password', placeholder: 'Secret key for API calls', type: 'password', required: true },
          { key: 'api_url', label: 'API Base URL', placeholder: 'https://api.gateway.com/v1', type: 'text', required: false },
          { key: 'environment', label: 'Environment', placeholder: 'sandbox or production', type: 'text', required: true },
        ]
      });
    });

    const allTmpls = [...GATEWAY_TEMPLATES, ...loadedCustomTemplates];

    for (const template of allTmpls) {
      const enabledSetting = existingSettings.find(s => s.key === `gateway_${template.id}_enabled`);
      const config: GatewayConfig = {
        id: template.id,
        enabled: enabledSetting?.value === 'true',
        credentials: {},
        template,
      };
      
      for (const field of template.fields) {
        const setting = existingSettings.find(s => s.key === `gateway_${template.id}_${field.key}`);
        config.credentials[field.key] = setting?.value || '';
      }
      
      configs[template.id] = config;
    }
    return { configs, customTmpls: loadedCustomTemplates };
  };

  const initialParse = parseExisting();
  const [customGateways, setCustomGateways] = useState<GatewayTemplate[]>(initialParse.customTmpls);
  const [gateways, setGateways] = useState<Record<string, GatewayConfig>>(initialParse.configs);

  const toggleGateway = (id: string) => {
    setGateways(prev => ({
      ...prev,
      [id]: { ...prev[id], enabled: !prev[id]?.enabled }
    }));
  };

  const updateCredential = (gatewayId: string, fieldKey: string, value: string) => {
    setGateways(prev => ({
      ...prev,
      [gatewayId]: {
        ...prev[gatewayId],
        credentials: { ...prev[gatewayId]?.credentials, [fieldKey]: value }
      }
    }));
  };

  const addCustomGateway = () => {
    const id = `custom_${Date.now()}`;
    const newTemplate: GatewayTemplate = {
      id,
      name: 'New Gateway',
      icon: FaGlobe,
      color: 'text-teal-500 bg-teal-500/10 border-teal-500/20',
      description: 'Custom payment gateway connection',
      fields: [
        { key: 'gateway_name', label: 'Gateway Name', placeholder: 'Enter the gateway name', type: 'text', required: true },
        { key: 'api_key', label: 'API Key / Merchant ID', placeholder: 'Primary authentication credential', type: 'text', required: true },
        { key: 'api_secret', label: 'API Secret / Password', placeholder: 'Secret key for API calls', type: 'password', required: true },
        { key: 'api_url', label: 'API Base URL', placeholder: 'https://api.gateway.com/v1', type: 'text', required: false },
        { key: 'environment', label: 'Environment', placeholder: 'sandbox or production', type: 'text', required: true },
      ]
    };
    setCustomGateways(prev => [...prev, newTemplate]);
    setGateways(prev => ({
      ...prev,
      [id]: { id, enabled: false, credentials: {}, template: newTemplate }
    }));
  };

  const removeCustomGateway = (id: string) => {
    setCustomGateways(prev => prev.filter(g => g.id !== id));
    setGateways(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleSaveAll = async () => {
    setIsLoading(true);
    setError(null);
    setSaved(false);

    try {
      const settings: { key: string; value: string; is_secret: boolean }[] = [];

      for (const [gatewayId, config] of Object.entries(gateways)) {
        settings.push({
          key: `gateway_${gatewayId}_enabled`,
          value: String(config.enabled),
          is_secret: false,
        });

        for (const field of config.template.fields) {
          const val = config.credentials[field.key] || '';
          settings.push({
            key: `gateway_${gatewayId}_${field.key}`,
            value: val,
            is_secret: field.type === 'password',
          });
        }
      }

      const result = await saveGatewayConfig(settings);
      if (result?.error) {
        setError(result.error);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 4000);
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const allTemplates = [...GATEWAY_TEMPLATES, ...customGateways];

  const hasCredentials = (gatewayId: string) => {
    const config = gateways[gatewayId];
    if (!config) return false;
    const requiredFields = config.template.fields.filter(f => f.required);
    return requiredFields.every(f => config.credentials[f.key]?.trim());
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-sm font-display font-light italic gold-text">Payment Gateways</h2>
          <p className="text-base tracking-widest uppercase text-cream/40 mt-2">
            Configure payment processors — {allTemplates.length} gateways available
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-sm font-bold tracking-widest uppercase text-green-500 animate-pulse flex items-center gap-1">
              <FaCheckCircle size={12} /> Saved Successfully
            </span>
          )}
          <button type="button" onClick={addCustomGateway} className="btn-outline-gold flex items-center gap-2">
            <FaPlus size={12} /> Add Gateway
          </button>
          <button type="button" onClick={handleSaveAll} disabled={isLoading} className="btn-gold flex items-center gap-2">
            <FaSave size={14} /> {isLoading ? 'Saving...' : 'Save All'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-ember-500/10 border border-ember-500/20 text-ember-500 p-4 rounded-sm text-sm">
          {error}
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-gold-500/5 border border-gold-500/20 p-5 rounded-sm">
        <p className="text-sm text-gold-500/80 leading-relaxed">
          💡 <strong>How it works:</strong> Enable a gateway, enter the API credentials from your merchant dashboard, and click "Save All". 
          The frontend checkout will automatically show only the enabled payment methods. Secret keys are encrypted and never exposed to the public.
        </p>
      </div>

      {/* Gateway Cards */}
      <div className="space-y-6">
        {allTemplates.map((template) => {
          const config = gateways[template.id];
          const isEnabled = config?.enabled || false;
          const isCustom = template.id.startsWith('custom_');
          const credsFilled = hasCredentials(template.id);

          return (
            <div key={template.id} className={`bg-charcoal rounded-sm border shadow-card overflow-hidden transition-all duration-300 ${
              isEnabled ? 'border-gold-500/30' : 'border-dark-border'
            }`}>
              {/* Gateway Header */}
              <div 
                className="px-8 py-5 bg-primary-black flex items-center justify-between cursor-pointer group"
                onClick={() => toggleGateway(template.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-sm flex items-center justify-center border ${template.color}`}>
                    <template.icon size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-display font-bold text-cream flex items-center gap-3">
                      {template.name}
                      {isEnabled && credsFilled && (
                        <span className="text-[9px] font-bold tracking-widest uppercase text-green-500 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-sm">
                          ● Connected
                        </span>
                      )}
                      {isEnabled && !credsFilled && (
                        <span className="text-[9px] font-bold tracking-widest uppercase text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-sm">
                          ⚠ Missing Credentials
                        </span>
                      )}
                      {!isEnabled && (
                        <span className="text-[9px] font-bold tracking-widest uppercase text-cream/30 bg-cream/5 border border-cream/10 px-2 py-0.5 rounded-sm">
                          Disabled
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-cream/40 mt-0.5">{template.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {isCustom && (
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeCustomGateway(template.id); }}
                      className="p-2 text-cream/20 hover:text-ember-500 transition-colors z-10"
                      title="Remove gateway"
                    >
                      <FaTrash size={14} />
                    </button>
                  )}
                  <button
                    type="button"
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                      isEnabled ? 'bg-gold-500' : 'bg-cream/10 group-hover:bg-cream/20'
                    }`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
                      isEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Gateway Fields (shown when enabled) */}
              {isEnabled && (
                <div className="p-8 space-y-5 border-t border-dark-border/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {template.fields.map((field) => (
                      <div key={field.key} className={field.key === 'return_url' || field.key === 'webhook_url' || field.key === 'api_url' ? 'md:col-span-2' : ''}>
                        <label className="text-sm font-bold text-cream/40 uppercase tracking-widest block mb-1 flex items-center gap-1">
                          {field.label}
                          {field.required && <span className="text-ember-500">*</span>}
                        </label>
                        <input
                          type={field.type}
                          value={config?.credentials[field.key] || ''}
                          onChange={(e) => updateCredential(template.id, field.key, e.target.value)}
                          placeholder={field.placeholder}
                          className="admin-input bg-primary-black w-full"
                        />
                        {field.helpText && (
                          <p className="text-[11px] text-cream/25 mt-1.5 leading-relaxed">{field.helpText}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* COD Section */}
      <div className="bg-charcoal rounded-sm border border-dark-border shadow-card overflow-hidden">
        <div className="px-8 py-5 bg-primary-black flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-sm flex items-center justify-center border text-gold-500 bg-gold-500/10 border-gold-500/20">
              <FaMoneyBillWave size={18} />
            </div>
            <div>
              <h3 className="text-sm font-display font-bold text-cream flex items-center gap-3">
                Cash on Delivery (COD)
                <span className="text-[9px] font-bold tracking-widest uppercase text-green-500 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-sm">
                  ● Always Active
                </span>
              </h3>
              <p className="text-sm text-cream/40 mt-0.5">No configuration needed — customers pay cash upon delivery</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
