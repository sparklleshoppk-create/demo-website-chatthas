-- Delivery Zones Table
CREATE TABLE delivery_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    min_distance_km NUMERIC(6,2) DEFAULT 0,
    max_distance_km NUMERIC(6,2) NOT NULL,
    delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
    estimated_time_minutes INT DEFAULT 30,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;

-- Public can read active zones
CREATE POLICY "Anyone can view active delivery zones"
ON delivery_zones FOR SELECT
USING (is_active = true);
