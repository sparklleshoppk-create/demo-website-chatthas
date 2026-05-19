-- Add tax_amount and delivery_instructions to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS tax_amount NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS delivery_instructions TEXT;

-- Seed website_settings for Tax Rate and Flat Delivery Fee
INSERT INTO public.website_settings (key, value, "group", description)
VALUES 
  ('tax_rate_percentage', '0', 'operating', 'Global tax percentage applied to order subtotal'),
  ('flat_delivery_fee', '0', 'operating', 'Flat delivery fee (overrides delivery zones if > 0)')
ON CONFLICT (key) DO NOTHING;
