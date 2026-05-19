-- Add loyalty_points to users table
ALTER TABLE users ADD COLUMN loyalty_points INT DEFAULT 0;

-- Create loyalty_transactions table to track history
CREATE TABLE loyalty_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    points_change INT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for loyalty_transactions
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own loyalty history"
ON loyalty_transactions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
