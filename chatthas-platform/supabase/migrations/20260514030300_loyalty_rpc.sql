-- Function to atomically increment loyalty points
CREATE OR REPLACE FUNCTION increment_loyalty_points(user_uuid UUID, points INT)
RETURNS VOID AS $$
BEGIN
    UPDATE users
    SET loyalty_points = loyalty_points + points
    WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
