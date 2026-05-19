-- Notification preferences and logs
CREATE TABLE notification_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type TEXT NOT NULL UNIQUE,
    sms_template TEXT,
    whatsapp_template TEXT,
    email_template TEXT,
    is_sms_enabled BOOLEAN DEFAULT false,
    is_whatsapp_enabled BOOLEAN DEFAULT false,
    is_email_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Pre-populate with default templates
INSERT INTO notification_templates (event_type, sms_template, whatsapp_template, email_template) VALUES
  ('order_confirmed', 'Your order {{order_number}} has been confirmed! Estimated delivery: {{estimated_time}} min.', 'Hi {{customer_name}}! 🎉 Your Chattha''s order #{{order_number}} is confirmed. We''re preparing your meal! ETA: {{estimated_time}} min.', 'Your order has been confirmed.'),
  ('order_preparing', 'Your Chattha''s order {{order_number}} is now being prepared in the kitchen! 🍳', 'Your Chattha''s order {{order_number}} is now cooking! 🍳 Almost there...', 'Your order is being prepared.'),
  ('order_ready', 'Your Chattha''s order {{order_number}} is ready! Rider is on the way 🏍️', '🛵 Your order #{{order_number}} is packed and the rider is heading to you!', 'Your order is ready for pickup/delivery.'),
  ('order_delivered', 'Your Chattha''s order {{order_number}} has been delivered! Enjoy your meal! 🎉', '🎉 Order delivered! We hope you enjoy your meal from Chattha''s. Leave us a review? ⭐', 'Your order has been delivered. Enjoy!'),
  ('order_cancelled', 'Your Chattha''s order {{order_number}} has been cancelled. If this was a mistake, please contact us.', '😔 Your Chattha''s order #{{order_number}} has been cancelled. Questions? Call us anytime.', 'Your order has been cancelled.');

-- Notification log for auditing
CREATE TABLE notification_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    channel TEXT CHECK (channel IN ('sms', 'whatsapp', 'email', 'push')),
    event_type TEXT,
    recipient TEXT,
    message TEXT,
    status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'pending')),
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;
