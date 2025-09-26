-- Sample data for PostgreSQL tables

-- Insert subscription plans
INSERT INTO subscription_plans (plan_name, description, price_monthly, price_annual, max_offline_downloads, audio_quality, ads_free, skip_limit) VALUES
('Free', 'Basic streaming with ads', 0.00, 0.00, 0, 'standard', false, 6),
('Premium', 'Ad-free streaming with unlimited skips', 9.99, 99.99, 10000, 'high', true, null),
('Family', 'Premium for up to 6 family members', 15.99, 159.99, 10000, 'high', true, null),
('Student', 'Premium at student discount', 4.99, 49.99, 10000, 'high', true, null);

-- Insert sample users
INSERT INTO users (username, email, password_hash, first_name, last_name, date_of_birth, country, email_verified) VALUES
('musiclover123', 'john.doe@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewfBmdlyffXfNeUe', 'John', 'Doe', '1995-03-15', 'USA', true),
('rockstar_anna', 'anna.smith@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewfBmdlyffXfNeUe', 'Anna', 'Smith', '1988-07-22', 'UK', true),
('jazzfan_mike', 'mike.johnson@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewfBmdlyffXfNeUe', 'Mike', 'Johnson', '1992-11-08', 'Canada', true),
('popqueen_lisa', 'lisa.garcia@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewfBmdlyffXfNeUe', 'Lisa', 'Garcia', '1997-01-30', 'Spain', true),
('hiphop_carlos', 'carlos.rodriguez@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewfBmdlyffXfNeUe', 'Carlos', 'Rodriguez', '1990-05-12', 'Mexico', true);

-- Get user IDs for subscriptions (we'll use the generated UUIDs)
-- In a real application, you'd capture these IDs from the INSERT statements

-- Create user subscriptions (assuming we know the user_ids)
-- Note: In practice, you'd need to get the actual UUIDs after insertion
INSERT INTO user_subscriptions (user_id, plan_id, status, payment_method)
SELECT 
    u.user_id, 
    p.plan_id, 
    'active',
    CASE 
        WHEN u.username = 'musiclover123' THEN 'credit_card'
        WHEN u.username = 'rockstar_anna' THEN 'paypal'
        WHEN u.username = 'jazzfan_mike' THEN 'credit_card'
        ELSE 'credit_card'
    END
FROM users u, subscription_plans p
WHERE 
    (u.username = 'musiclover123' AND p.plan_name = 'Premium') OR
    (u.username = 'rockstar_anna' AND p.plan_name = 'Family') OR
    (u.username = 'jazzfan_mike' AND p.plan_name = 'Student') OR
    (u.username = 'popqueen_lisa' AND p.plan_name = 'Free') OR
    (u.username = 'hiphop_carlos' AND p.plan_name = 'Premium');

-- Create sample playlists
INSERT INTO playlists (user_id, name, description, is_public, track_count, total_duration_seconds)
SELECT 
    user_id,
    playlist_name,
    description,
    is_public,
    track_count,
    total_duration_seconds
FROM users u
CROSS JOIN (
    VALUES 
        ('My Favorites', 'Collection of my all-time favorite songs', true, 25, 6000),
        ('Workout Mix', 'High energy songs for gym sessions', true, 30, 7200),
        ('Chill Vibes', 'Relaxing music for study and work', false, 20, 4800),
        ('Road Trip', 'Perfect songs for long drives', true, 40, 9600)
) AS playlist_data(playlist_name, description, is_public, track_count, total_duration_seconds)
WHERE u.username IN ('musiclover123', 'rockstar_anna', 'jazzfan_mike');

-- Create user follows relationships
INSERT INTO user_follows (follower_id, followed_id)
SELECT f.user_id, fo.user_id
FROM users f, users fo
WHERE f.username = 'musiclover123' AND fo.username IN ('rockstar_anna', 'jazzfan_mike')
UNION ALL
SELECT f.user_id, fo.user_id
FROM users f, users fo
WHERE f.username = 'rockstar_anna' AND fo.username IN ('musiclover123', 'popqueen_lisa')
UNION ALL
SELECT f.user_id, fo.user_id
FROM users f, users fo
WHERE f.username = 'jazzfan_mike' AND fo.username IN ('musiclover123', 'hiphop_carlos');

-- Create user preferences
INSERT INTO user_preferences (user_id, preferred_audio_quality, explicit_content_allowed, auto_play, crossfade_duration)
SELECT 
    user_id,
    CASE username
        WHEN 'musiclover123' THEN 'high'
        WHEN 'rockstar_anna' THEN 'high'
        WHEN 'jazzfan_mike' THEN 'high'
        ELSE 'standard'
    END,
    CASE username
        WHEN 'popqueen_lisa' THEN false
        ELSE true
    END,
    true,
    CASE username
        WHEN 'rockstar_anna' THEN 5
        ELSE 0
    END
FROM users;