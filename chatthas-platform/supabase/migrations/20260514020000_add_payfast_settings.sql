-- Add PayFast settings for local Pakistani payments
INSERT INTO website_settings (key, value, "group", description, is_secret)
VALUES 
('payfast_merchant_id', '', 'payments', 'PayFast Merchant ID', false),
('payfast_secured_key', '', 'payments', 'PayFast Secured Key (Secret)', true),
('payfast_mode', 'sandbox', 'payments', 'PayFast Mode (sandbox or live)', false)
ON CONFLICT (key) DO NOTHING;
