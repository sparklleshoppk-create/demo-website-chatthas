-- Add Stripe settings
INSERT INTO website_settings (key, value, "group", description, is_secret)
VALUES 
('stripe_publishable_key', '', 'payments', 'Stripe Publishable Key (Public)', false),
('stripe_secret_key', '', 'payments', 'Stripe Secret Key (Private)', true)
ON CONFLICT (key) DO NOTHING;
