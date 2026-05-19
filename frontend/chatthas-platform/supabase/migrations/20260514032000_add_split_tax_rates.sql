-- Seed split tax rate settings for COD vs Digital Payments
INSERT INTO public.website_settings (key, value, "group", description)
VALUES 
  ('tax_rate_digital', '16', 'operating', 'Tax percentage applied for Card/Mobile payments'),
  ('tax_rate_cod', '0', 'operating', 'Tax percentage applied for Cash on Delivery')
ON CONFLICT (key) DO NOTHING;
