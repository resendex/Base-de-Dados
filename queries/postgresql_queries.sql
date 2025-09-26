-- Common Queries for Music Streaming Platform (PostgreSQL)

-- ========================================
-- USER MANAGEMENT QUERIES
-- ========================================

-- Get user profile with subscription details
SELECT 
    u.username,
    u.email,
    u.first_name,
    u.last_name,
    u.country,
    u.created_at,
    sp.plan_name,
    sp.price_monthly,
    us.status as subscription_status,
    us.start_date,
    us.end_date
FROM users u
LEFT JOIN user_subscriptions us ON u.user_id = us.user_id AND us.status = 'active'
LEFT JOIN subscription_plans sp ON us.plan_id = sp.plan_id
WHERE u.username = 'musiclover123';

-- Get all active premium users
SELECT 
    u.username,
    u.email,
    u.first_name,
    u.last_name,
    sp.plan_name,
    us.start_date
FROM users u
JOIN user_subscriptions us ON u.user_id = us.user_id
JOIN subscription_plans sp ON us.plan_id = sp.plan_id
WHERE us.status = 'active' 
    AND sp.plan_name IN ('Premium', 'Family', 'Student')
ORDER BY us.start_date DESC;

-- Find users whose subscriptions are expiring soon (within 7 days)
SELECT 
    u.username,
    u.email,
    sp.plan_name,
    us.end_date,
    us.auto_renew
FROM users u
JOIN user_subscriptions us ON u.user_id = us.user_id
JOIN subscription_plans sp ON us.plan_id = sp.plan_id
WHERE us.status = 'active'
    AND us.end_date IS NOT NULL
    AND us.end_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
    AND us.auto_renew = false
ORDER BY us.end_date;

-- ========================================
-- PLAYLIST QUERIES
-- ========================================

-- Get user's playlists with track counts
SELECT 
    p.playlist_id,
    p.name,
    p.description,
    p.is_public,
    p.is_collaborative,
    p.track_count,
    p.total_duration_seconds,
    ROUND(p.total_duration_seconds / 60.0, 1) as duration_minutes,
    p.created_at,
    p.updated_at
FROM playlists p
JOIN users u ON p.user_id = u.user_id
WHERE u.username = 'musiclover123'
ORDER BY p.updated_at DESC;

-- Get public playlists with most tracks
SELECT 
    p.name as playlist_name,
    u.username as creator,
    p.track_count,
    p.total_duration_seconds,
    p.created_at
FROM playlists p
JOIN users u ON p.user_id = u.user_id
WHERE p.is_public = true
ORDER BY p.track_count DESC
LIMIT 10;

-- Get collaborative playlists with their collaborators
SELECT 
    p.name as playlist_name,
    u.username as owner,
    array_agg(u_collab.username) as collaborators,
    p.track_count
FROM playlists p
JOIN users u ON p.user_id = u.user_id
LEFT JOIN playlist_collaborators pc ON p.playlist_id = pc.playlist_id
LEFT JOIN users u_collab ON pc.user_id = u_collab.user_id
WHERE p.is_collaborative = true
GROUP BY p.playlist_id, p.name, u.username, p.track_count
ORDER BY p.track_count DESC;

-- ========================================
-- SOCIAL FEATURES QUERIES
-- ========================================

-- Get user's followers and following counts
SELECT 
    u.username,
    (
        SELECT COUNT(*) 
        FROM user_follows uf 
        WHERE uf.followed_id = u.user_id
    ) as followers_count,
    (
        SELECT COUNT(*) 
        FROM user_follows uf 
        WHERE uf.follower_id = u.user_id
    ) as following_count
FROM users u
WHERE u.username = 'musiclover123';

-- Get user's followers
SELECT 
    follower.username,
    follower.first_name,
    follower.last_name,
    uf.created_at as followed_since
FROM user_follows uf
JOIN users u ON uf.followed_id = u.user_id
JOIN users follower ON uf.follower_id = follower.user_id
WHERE u.username = 'musiclover123'
ORDER BY uf.created_at DESC;

-- Get mutual followers between two users
SELECT 
    mutual.username,
    mutual.first_name,
    mutual.last_name
FROM users u1
JOIN user_follows uf1 ON u1.user_id = uf1.followed_id
JOIN users u2 ON u2.user_id = uf1.follower_id
JOIN user_follows uf2 ON u2.user_id = uf2.followed_id
JOIN users mutual ON uf2.follower_id = mutual.user_id
WHERE u1.username = 'musiclover123'
    AND uf1.follower_id IN (
        SELECT uf.follower_id 
        FROM user_follows uf
        JOIN users u ON uf.followed_id = u.user_id
        WHERE u.username = 'rockstar_anna'
    )
ORDER BY mutual.username;

-- ========================================
-- SUBSCRIPTION ANALYTICS
-- ========================================

-- Revenue analysis by subscription plan
SELECT 
    sp.plan_name,
    COUNT(us.subscription_id) as active_subscribers,
    SUM(sp.price_monthly) as monthly_revenue,
    SUM(sp.price_monthly * 12) as annual_revenue_potential
FROM subscription_plans sp
LEFT JOIN user_subscriptions us ON sp.plan_id = us.plan_id AND us.status = 'active'
GROUP BY sp.plan_id, sp.plan_name, sp.price_monthly
ORDER BY monthly_revenue DESC;

-- Subscription conversion funnel
SELECT 
    'Total Users' as stage,
    COUNT(*) as count
FROM users
WHERE is_active = true

UNION ALL

SELECT 
    'Users with Subscription' as stage,
    COUNT(DISTINCT us.user_id) as count
FROM user_subscriptions us
WHERE us.status = 'active'

UNION ALL

SELECT 
    'Paid Subscribers' as stage,
    COUNT(DISTINCT us.user_id) as count
FROM user_subscriptions us
JOIN subscription_plans sp ON us.plan_id = sp.plan_id
WHERE us.status = 'active' AND sp.price_monthly > 0

UNION ALL

SELECT 
    'Premium+ Subscribers' as stage,
    COUNT(DISTINCT us.user_id) as count
FROM user_subscriptions us
JOIN subscription_plans sp ON us.plan_id = sp.plan_id
WHERE us.status = 'active' 
    AND sp.plan_name IN ('Premium', 'Family');

-- Monthly cohort analysis for subscriptions
SELECT 
    DATE_TRUNC('month', us.start_date) as cohort_month,
    COUNT(*) as new_subscribers,
    COUNT(CASE WHEN us.status = 'active' THEN 1 END) as still_active,
    ROUND(
        100.0 * COUNT(CASE WHEN us.status = 'active' THEN 1 END) / COUNT(*),
        2
    ) as retention_rate
FROM user_subscriptions us
WHERE us.start_date >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', us.start_date)
ORDER BY cohort_month;

-- ========================================
-- USER PREFERENCES & SETTINGS
-- ========================================

-- Audio quality preference distribution
SELECT 
    up.preferred_audio_quality,
    COUNT(*) as user_count,
    ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) as percentage
FROM user_preferences up
GROUP BY up.preferred_audio_quality
ORDER BY user_count DESC;

-- Users who allow explicit content vs subscription type
SELECT 
    sp.plan_name,
    COUNT(CASE WHEN up.explicit_content_allowed = true THEN 1 END) as allows_explicit,
    COUNT(CASE WHEN up.explicit_content_allowed = false THEN 1 END) as blocks_explicit,
    COUNT(*) as total_users
FROM user_preferences up
JOIN users u ON up.user_id = u.user_id
LEFT JOIN user_subscriptions us ON u.user_id = us.user_id AND us.status = 'active'
LEFT JOIN subscription_plans sp ON us.plan_id = sp.plan_id
GROUP BY sp.plan_name
ORDER BY total_users DESC;