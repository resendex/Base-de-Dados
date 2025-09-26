// Common Queries for Music Streaming Platform (MongoDB)

use music_streaming_platform;

// ========================================
// MUSIC LIBRARY QUERIES
// ========================================

// Get all songs by a specific artist
db.songs.find(
    { artist_name: "The Midnight Symphony" },
    {
        title: 1,
        album_name: 1,
        duration_ms: 1,
        popularity_score: 1,
        release_date: 1
    }
).sort({ popularity_score: -1 });

// Find songs by genre with high energy
db.songs.find(
    {
        genres: "Electronic",
        "audio_features.energy": { $gte: 0.8 }
    },
    {
        title: 1,
        artist_name: 1,
        "audio_features.energy": 1,
        popularity_score: 1
    }
).sort({ popularity_score: -1 });

// Get top songs by popularity in a specific genre
db.songs.find(
    { genres: { $in: ["Pop", "Latin Pop"] } },
    {
        title: 1,
        artist_name: 1,
        popularity_score: 1,
        release_date: 1
    }
).sort({ popularity_score: -1 }).limit(10);

// Find songs perfect for dancing (high danceability and energy)
db.songs.find(
    {
        "audio_features.danceability": { $gte: 0.75 },
        "audio_features.energy": { $gte: 0.75 }
    },
    {
        title: 1,
        artist_name: 1,
        "audio_features.danceability": 1,
        "audio_features.energy": 1,
        "audio_features.tempo": 1
    }
).sort({ "audio_features.danceability": -1 });

// Get songs released in the last 6 months
var sixMonthsAgo = new Date();
sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

db.songs.find(
    { release_date: { $gte: sixMonthsAgo } },
    {
        title: 1,
        artist_name: 1,
        album_name: 1,
        release_date: 1,
        popularity_score: 1
    }
).sort({ release_date: -1 });

// ========================================
// PLAYLIST QUERIES
// ========================================

// Get all tracks in a specific playlist
db.playlist_tracks.find(
    { playlist_id: "d4e5f6a7-b8c9-0123-def1-234567890123" },
    {
        song_title: 1,
        artist_name: 1,
        position: 1,
        added_at: 1
    }
).sort({ position: 1 });

// Find playlists containing a specific song
db.playlist_tracks.find(
    { song_title: "Electric Sunset" },
    { playlist_id: 1, added_by: 1, added_at: 1 }
);

// Get recently added tracks across all playlists
db.playlist_tracks.find(
    {},
    {
        playlist_id: 1,
        song_title: 1,
        artist_name: 1,
        added_by: 1,
        added_at: 1
    }
).sort({ added_at: -1 }).limit(20);

// ========================================
// USER LISTENING STATISTICS
// ========================================

// Get user's listening history for the last 30 days
var thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

db.user_statistics.find(
    {
        user_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        created_at: { $gte: thirtyDaysAgo }
    },
    {
        song_id: 1,
        completion_percentage: 1,
        device_type: 1,
        created_at: 1
    }
).sort({ created_at: -1 });

// Aggregate user's top artists by listening time
db.user_statistics.aggregate([
    {
        $match: {
            user_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            completion_percentage: { $gte: 50 } // Only count meaningful listens
        }
    },
    {
        $lookup: {
            from: "songs",
            localField: "song_id",
            foreignField: "_id",
            as: "song_info"
        }
    },
    { $unwind: "$song_info" },
    {
        $group: {
            _id: "$song_info.artist_name",
            total_listening_time_ms: {
                $sum: {
                    $multiply: [
                        "$song_info.duration_ms",
                        { $divide: ["$completion_percentage", 100] }
                    ]
                }
            },
            play_count: { $sum: 1 },
            avg_completion: { $avg: "$completion_percentage" }
        }
    },
    {
        $addFields: {
            total_listening_minutes: {
                $round: [{ $divide: ["$total_listening_time_ms", 60000] }, 1]
            }
        }
    },
    { $sort: { total_listening_time_ms: -1 } }
]);

// Find user's most played songs
db.user_statistics.aggregate([
    {
        $match: {
            user_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
        }
    },
    {
        $group: {
            _id: "$song_id",
            play_count: { $sum: 1 },
            avg_completion: { $avg: "$completion_percentage" },
            last_played: { $max: "$created_at" }
        }
    },
    {
        $lookup: {
            from: "songs",
            localField: "_id",
            foreignField: "_id",
            as: "song_info"
        }
    },
    { $unwind: "$song_info" },
    {
        $project: {
            song_title: "$song_info.title",
            artist_name: "$song_info.artist_name",
            play_count: 1,
            avg_completion: { $round: ["$avg_completion", 1] },
            last_played: 1
        }
    },
    { $sort: { play_count: -1 } },
    { $limit: 10 }
]);

// Device usage analysis for a user
db.user_statistics.aggregate([
    {
        $match: {
            user_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
        }
    },
    {
        $group: {
            _id: "$device_type",
            play_count: { $sum: 1 },
            avg_completion: { $avg: "$completion_percentage" }
        }
    },
    {
        $project: {
            device_type: "$_id",
            play_count: 1,
            avg_completion: { $round: ["$avg_completion", 1] },
            _id: 0
        }
    },
    { $sort: { play_count: -1 } }
]);

// ========================================
// RECOMMENDATIONS QUERIES
// ========================================

// Get current recommendations for a user
db.user_recommendations.find(
    {
        user_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        expires_at: { $gt: new Date() }
    },
    {
        recommendation_type: 1,
        recommendations: 1,
        generated_at: 1,
        engagement_stats: 1
    }
).sort({ generated_at: -1 });

// Find recommendations with high engagement
db.user_recommendations.find(
    {
        "engagement_stats.clicks": { $gte: 2 },
        expires_at: { $gt: new Date() }
    },
    {
        user_id: 1,
        recommendation_type: 1,
        "engagement_stats.clicks": 1,
        "engagement_stats.likes": 1,
        generated_at: 1
    }
).sort({ "engagement_stats.clicks": -1 });

// Get recommendation performance by type
db.user_recommendations.aggregate([
    {
        $match: {
            generated_at: { $gte: new Date("2023-09-01") }
        }
    },
    {
        $group: {
            _id: "$recommendation_type",
            total_generated: { $sum: 1 },
            avg_views: { $avg: "$engagement_stats.views" },
            avg_clicks: { $avg: "$engagement_stats.clicks" },
            avg_likes: { $avg: "$engagement_stats.likes" },
            total_clicks: { $sum: "$engagement_stats.clicks" }
        }
    },
    {
        $addFields: {
            click_through_rate: {
                $round: [
                    { $multiply: [{ $divide: ["$avg_clicks", "$avg_views"] }, 100] },
                    2
                ]
            }
        }
    },
    { $sort: { click_through_rate: -1 } }
]);

// ========================================
// ARTIST & ALBUM ANALYTICS
// ========================================

// Top artists by monthly listeners
db.artists.find(
    {},
    {
        name: 1,
        monthly_listeners: 1,
        genres: 1,
        country: 1,
        verified: 1
    }
).sort({ monthly_listeners: -1 }).limit(10);

// Artists by country with listener counts
db.artists.aggregate([
    {
        $group: {
            _id: "$country",
            artist_count: { $sum: 1 },
            total_monthly_listeners: { $sum: "$monthly_listeners" },
            avg_monthly_listeners: { $avg: "$monthly_listeners" }
        }
    },
    {
        $project: {
            country: "$_id",
            artist_count: 1,
            total_monthly_listeners: 1,
            avg_monthly_listeners: { $round: ["$avg_monthly_listeners", 0] },
            _id: 0
        }
    },
    { $sort: { total_monthly_listeners: -1 } }
]);

// Most popular albums released this year
var currentYear = new Date().getFullYear();
var yearStart = new Date(currentYear, 0, 1);

db.albums.find(
    { release_date: { $gte: yearStart } },
    {
        title: 1,
        artist_name: 1,
        release_date: 1,
        popularity_score: 1,
        total_tracks: 1
    }
).sort({ popularity_score: -1 }).limit(10);

// Genre distribution across all songs
db.songs.aggregate([
    { $unwind: "$genres" },
    {
        $group: {
            _id: "$genres",
            song_count: { $sum: 1 },
            avg_popularity: { $avg: "$popularity_score" }
        }
    },
    {
        $project: {
            genre: "$_id",
            song_count: 1,
            avg_popularity: { $round: ["$avg_popularity", 1] },
            _id: 0
        }
    },
    { $sort: { song_count: -1 } }
]);

// ========================================
// USER ACTIVITY ANALYSIS
// ========================================

// Recent user activities across platform
db.user_activity.find(
    {},
    {
        user_id: 1,
        activity_type: 1,
        target_type: 1,
        timestamp: 1,
        metadata: 1
    }
).sort({ timestamp: -1 }).limit(20);

// Activity patterns by time of day
db.user_activity.aggregate([
    {
        $project: {
            hour: { $hour: "$timestamp" },
            activity_type: 1
        }
    },
    {
        $group: {
            _id: {
                hour: "$hour",
                activity_type: "$activity_type"
            },
            count: { $sum: 1 }
        }
    },
    {
        $group: {
            _id: "$_id.hour",
            activities: {
                $push: {
                    type: "$_id.activity_type",
                    count: "$count"
                }
            },
            total_activity: { $sum: "$count" }
        }
    },
    { $sort: { _id: 1 } }
]);

// Most active users (by activity count)
db.user_activity.aggregate([
    {
        $group: {
            _id: "$user_id",
            activity_count: { $sum: 1 },
            last_activity: { $max: "$timestamp" },
            activity_types: { $addToSet: "$activity_type" }
        }
    },
    {
        $project: {
            user_id: "$_id",
            activity_count: 1,
            last_activity: 1,
            unique_activity_types: { $size: "$activity_types" },
            _id: 0
        }
    },
    { $sort: { activity_count: -1 } },
    { $limit: 10 }
]);

print("Common MongoDB queries ready to execute!");