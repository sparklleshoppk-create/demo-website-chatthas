-- Update orders table for advanced tracking
ALTER TABLE orders ADD COLUMN rider_info JSONB DEFAULT '{}'::jsonb;
ALTER TABLE orders ADD COLUMN tracking_history JSONB DEFAULT '[]'::jsonb;
