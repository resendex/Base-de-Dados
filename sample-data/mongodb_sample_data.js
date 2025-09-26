// Sample data for MongoDB collections

use music_streaming_platform;

// Sample Artists
db.artists.insertMany([
  {
    name: "The Midnight Symphony",
    biography: "Electronic duo known for their synthwave and ambient compositions",
    genres: ["Electronic", "Synthwave", "Ambient"],
    country: "USA",
    profile_image_url: "https://example.com/artists/midnight-symphony.jpg",
    social_media: {
      spotify: "https://open.spotify.com/artist/midnight-symphony",
      youtube: "https://youtube.com/@midnightsymphony",
      instagram: "@midnightsymphony"
    },
    monthly_listeners: 2500000,
    verified: true,
    created_at: new Date("2018-03-15"),
    updated_at: new Date()
  },
  {
    name: "Luna Rodriguez",
    biography: "Latin pop sensation with powerful vocals and meaningful lyrics",
    genres: ["Latin Pop", "Pop", "R&B"],
    country: "Argentina",
    profile_image_url: "https://example.com/artists/luna-rodriguez.jpg",
    social_media: {
      instagram: "@lunarodriguezmusic",
      twitter: "@lunarodriguez"
    },
    monthly_listeners: 5800000,
    verified: true,
    created_at: new Date("2019-07-22"),
    updated_at: new Date()
  },
  {
    name: "Jazz Collective",
    biography: "Contemporary jazz ensemble pushing boundaries of traditional jazz",
    genres: ["Jazz", "Contemporary Jazz", "Fusion"],
    country: "France",
    profile_image_url: "https://example.com/artists/jazz-collective.jpg",
    monthly_listeners: 890000,
    verified: true,
    created_at: new Date("2015-11-08"),
    updated_at: new Date()
  },
  {
    name: "Indie Hearts",
    biography: "Indie rock band with dreamy melodies and introspective lyrics",
    genres: ["Indie Rock", "Alternative", "Dream Pop"],
    country: "UK",
    profile_image_url: "https://example.com/artists/indie-hearts.jpg",
    monthly_listeners: 1200000,
    verified: false,
    created_at: new Date("2020-01-30"),
    updated_at: new Date()
  },
  {
    name: "Urban Flow",
    biography: "Hip-hop artist known for conscious rap and innovative beats",
    genres: ["Hip-Hop", "Rap", "Conscious Hip-Hop"],
    country: "USA",
    profile_image_url: "https://example.com/artists/urban-flow.jpg",
    social_media: {
      instagram: "@urbanflowmusic",
      youtube: "https://youtube.com/@urbanflow"
    },
    monthly_listeners: 3200000,
    verified: true,
    created_at: new Date("2017-05-12"),
    updated_at: new Date()
  }
]);

// Get artist IDs for reference
var midnight_symphony_id = db.artists.findOne({name: "The Midnight Symphony"})._id;
var luna_rodriguez_id = db.artists.findOne({name: "Luna Rodriguez"})._id;
var jazz_collective_id = db.artists.findOne({name: "Jazz Collective"})._id;
var indie_hearts_id = db.artists.findOne({name: "Indie Hearts"})._id;
var urban_flow_id = db.artists.findOne({name: "Urban Flow"})._id;

// Sample Albums
db.albums.insertMany([
  {
    title: "Neon Dreams",
    artist_id: midnight_symphony_id,
    artist_name: "The Midnight Symphony",
    release_date: new Date("2022-06-15"),
    genre: ["Electronic", "Synthwave"],
    cover_image_url: "https://example.com/albums/neon-dreams.jpg",
    label: "Synthwave Records",
    total_tracks: 10,
    total_duration_ms: 2940000, // 49 minutes
    album_type: "album",
    explicit: false,
    popularity_score: 85.5,
    created_at: new Date("2022-06-15"),
    updated_at: new Date()
  },
  {
    title: "Corazón Latino",
    artist_id: luna_rodriguez_id,
    artist_name: "Luna Rodriguez",
    release_date: new Date("2023-03-10"),
    genre: ["Latin Pop", "Pop"],
    cover_image_url: "https://example.com/albums/corazon-latino.jpg",
    label: "Universal Latin",
    total_tracks: 12,
    total_duration_ms: 3120000, // 52 minutes
    album_type: "album",
    explicit: false,
    popularity_score: 92.1,
    created_at: new Date("2023-03-10"),
    updated_at: new Date()
  },
  {
    title: "After Midnight",
    artist_id: jazz_collective_id,
    artist_name: "Jazz Collective",
    release_date: new Date("2023-01-20"),
    genre: ["Jazz", "Contemporary Jazz"],
    cover_image_url: "https://example.com/albums/after-midnight.jpg",
    label: "Blue Note Records",
    total_tracks: 8,
    total_duration_ms: 3600000, // 60 minutes
    album_type: "album",
    explicit: false,
    popularity_score: 78.3,
    created_at: new Date("2023-01-20"),
    updated_at: new Date()
  }
]);

// Get album IDs for reference
var neon_dreams_id = db.albums.findOne({title: "Neon Dreams"})._id;
var corazon_latino_id = db.albums.findOne({title: "Corazón Latino"})._id;
var after_midnight_id = db.albums.findOne({title: "After Midnight"})._id;

// Sample Songs
db.songs.insertMany([
  {
    title: "Electric Sunset",
    artist_id: midnight_symphony_id,
    artist_name: "The Midnight Symphony",
    album_id: neon_dreams_id,
    album_name: "Neon Dreams",
    track_number: 1,
    duration_ms: 294000, // 4:54
    genres: ["Electronic", "Synthwave"],
    release_date: new Date("2022-06-15"),
    explicit: false,
    popularity_score: 88.7,
    audio_features: {
      danceability: 0.75,
      energy: 0.82,
      valence: 0.68,
      tempo: 126.5,
      key: 7,
      mode: 1,
      time_signature: 4
    },
    file_urls: {
      preview: "https://example.com/preview/electric-sunset.mp3",
      standard_quality: "https://example.com/standard/electric-sunset.mp3",
      high_quality: "https://example.com/high/electric-sunset.mp3"
    },
    created_at: new Date("2022-06-15"),
    updated_at: new Date()
  },
  {
    title: "Midnight Drive",
    artist_id: midnight_symphony_id,
    artist_name: "The Midnight Symphony",
    album_id: neon_dreams_id,
    album_name: "Neon Dreams",
    track_number: 2,
    duration_ms: 312000, // 5:12
    genres: ["Electronic", "Synthwave"],
    release_date: new Date("2022-06-15"),
    explicit: false,
    popularity_score: 91.2,
    audio_features: {
      danceability: 0.70,
      energy: 0.78,
      valence: 0.65,
      tempo: 118.0,
      key: 2,
      mode: 0,
      time_signature: 4
    },
    file_urls: {
      preview: "https://example.com/preview/midnight-drive.mp3",
      standard_quality: "https://example.com/standard/midnight-drive.mp3",
      high_quality: "https://example.com/high/midnight-drive.mp3"
    },
    created_at: new Date("2022-06-15"),
    updated_at: new Date()
  },
  {
    title: "Fuego en el Alma",
    artist_id: luna_rodriguez_id,
    artist_name: "Luna Rodriguez",
    album_id: corazon_latino_id,
    album_name: "Corazón Latino",
    track_number: 1,
    duration_ms: 248000, // 4:08
    genres: ["Latin Pop", "Pop"],
    release_date: new Date("2023-03-10"),
    explicit: false,
    popularity_score: 95.8,
    audio_features: {
      danceability: 0.85,
      energy: 0.89,
      valence: 0.78,
      tempo: 128.5,
      key: 5,
      mode: 1,
      time_signature: 4
    },
    lyrics: "En el fuego de mi alma, brilla tu amor...",
    file_urls: {
      preview: "https://example.com/preview/fuego-en-el-alma.mp3",
      standard_quality: "https://example.com/standard/fuego-en-el-alma.mp3",
      high_quality: "https://example.com/high/fuego-en-el-alma.mp3"
    },
    created_at: new Date("2023-03-10"),
    updated_at: new Date()
  },
  {
    title: "Blue Notes at Dawn",
    artist_id: jazz_collective_id,
    artist_name: "Jazz Collective",
    album_id: after_midnight_id,
    album_name: "After Midnight",
    track_number: 3,
    duration_ms: 420000, // 7:00
    genres: ["Jazz", "Contemporary Jazz"],
    release_date: new Date("2023-01-20"),
    explicit: false,
    popularity_score: 82.1,
    audio_features: {
      danceability: 0.45,
      energy: 0.55,
      valence: 0.52,
      tempo: 95.0,
      key: 9,
      mode: 0,
      time_signature: 4
    },
    file_urls: {
      preview: "https://example.com/preview/blue-notes-at-dawn.mp3",
      standard_quality: "https://example.com/standard/blue-notes-at-dawn.mp3",
      high_quality: "https://example.com/high/blue-notes-at-dawn.mp3"
    },
    created_at: new Date("2023-01-20"),
    updated_at: new Date()
  },
  {
    title: "City Lights",
    artist_id: urban_flow_id,
    artist_name: "Urban Flow",
    track_number: 1,
    duration_ms: 198000, // 3:18
    genres: ["Hip-Hop", "Rap"],
    release_date: new Date("2023-08-15"),
    explicit: true,
    popularity_score: 89.4,
    audio_features: {
      danceability: 0.80,
      energy: 0.85,
      valence: 0.70,
      tempo: 140.0,
      key: 1,
      mode: 1,
      time_signature: 4
    },
    file_urls: {
      preview: "https://example.com/preview/city-lights.mp3",
      standard_quality: "https://example.com/standard/city-lights.mp3",
      high_quality: "https://example.com/high/city-lights.mp3"
    },
    created_at: new Date("2023-08-15"),
    updated_at: new Date()
  }
]);

// Get song IDs for sample playlist tracks and statistics
var electric_sunset_id = db.songs.findOne({title: "Electric Sunset"})._id;
var midnight_drive_id = db.songs.findOne({title: "Midnight Drive"})._id;
var fuego_id = db.songs.findOne({title: "Fuego en el Alma"})._id;
var blue_notes_id = db.songs.findOne({title: "Blue Notes at Dawn"})._id;
var city_lights_id = db.songs.findOne({title: "City Lights"})._id;

// Sample playlist tracks (using sample user UUIDs)
var sample_user_ids = [
  "a1b2c3d4-e5f6-7890-abcd-ef1234567890", // musiclover123
  "b2c3d4e5-f6a7-8901-bcde-f12345678901", // rockstar_anna
  "c3d4e5f6-a7b8-9012-cdef-123456789012"  // jazzfan_mike
];

var sample_playlist_ids = [
  "d4e5f6a7-b8c9-0123-def1-234567890123", // My Favorites
  "e5f6a7b8-c9d0-1234-ef12-345678901234", // Workout Mix
  "f6a7b8c9-d0e1-2345-f123-456789012345"  // Chill Vibes
];

db.playlist_tracks.insertMany([
  {
    playlist_id: sample_playlist_ids[0],
    song_id: electric_sunset_id,
    song_title: "Electric Sunset",
    artist_name: "The Midnight Symphony",
    position: 1,
    added_by: sample_user_ids[0],
    added_at: new Date("2023-09-01")
  },
  {
    playlist_id: sample_playlist_ids[0],
    song_id: fuego_id,
    song_title: "Fuego en el Alma",
    artist_name: "Luna Rodriguez",
    position: 2,
    added_by: sample_user_ids[0],
    added_at: new Date("2023-09-02")
  },
  {
    playlist_id: sample_playlist_ids[1],
    song_id: city_lights_id,
    song_title: "City Lights",
    artist_name: "Urban Flow",
    position: 1,
    added_by: sample_user_ids[1],
    added_at: new Date("2023-09-03")
  },
  {
    playlist_id: sample_playlist_ids[2],
    song_id: blue_notes_id,
    song_title: "Blue Notes at Dawn",
    artist_name: "Jazz Collective",
    position: 1,
    added_by: sample_user_ids[2],
    added_at: new Date("2023-09-04")
  }
]);

// Sample user statistics
db.user_statistics.insertMany([
  {
    user_id: sample_user_ids[0],
    song_id: electric_sunset_id,
    artist_id: midnight_symphony_id,
    play_duration_ms: 294000,
    completion_percentage: 100,
    skip_time_ms: 0,
    device_type: "desktop",
    shuffle_mode: false,
    repeat_mode: "off",
    created_at: new Date("2023-09-15T10:30:00Z")
  },
  {
    user_id: sample_user_ids[0],
    song_id: fuego_id,
    artist_id: luna_rodriguez_id,
    play_duration_ms: 180000,
    completion_percentage: 72.6,
    skip_time_ms: 180000,
    device_type: "mobile",
    shuffle_mode: true,
    repeat_mode: "context",
    created_at: new Date("2023-09-15T11:15:00Z")
  },
  {
    user_id: sample_user_ids[1],
    song_id: city_lights_id,
    artist_id: urban_flow_id,
    play_duration_ms: 198000,
    completion_percentage: 100,
    skip_time_ms: 0,
    device_type: "mobile",
    shuffle_mode: false,
    repeat_mode: "track",
    created_at: new Date("2023-09-15T14:20:00Z")
  }
]);

// Sample user recommendations
db.user_recommendations.insertMany([
  {
    user_id: sample_user_ids[0],
    recommendation_type: "discover_weekly",
    recommendations: [
      {
        song_id: midnight_drive_id,
        score: 0.92,
        reason: "Similar to your liked synthwave tracks"
      },
      {
        song_id: blue_notes_id,
        score: 0.78,
        reason: "Users with similar taste enjoy this jazz piece"
      }
    ],
    based_on: {
      listening_history: true,
      liked_songs: true,
      followed_artists: false,
      similar_users: true,
      mood_analysis: false
    },
    generated_at: new Date("2023-09-15T00:00:00Z"),
    expires_at: new Date("2023-09-22T00:00:00Z"),
    engagement_stats: {
      views: 1,
      clicks: 0,
      skips: 0,
      likes: 0
    }
  },
  {
    user_id: sample_user_ids[1],
    recommendation_type: "daily_mix",
    recommendations: [
      {
        song_id: fuego_id,
        score: 0.95,
        reason: "Top Latin pop track trending now"
      },
      {
        song_id: city_lights_id,
        score: 0.88,
        reason: "Matches your hip-hop listening patterns"
      }
    ],
    based_on: {
      listening_history: true,
      liked_songs: true,
      followed_artists: true,
      similar_users: false,
      mood_analysis: true
    },
    generated_at: new Date("2023-09-15T06:00:00Z"),
    expires_at: new Date("2023-09-16T06:00:00Z"),
    engagement_stats: {
      views: 3,
      clicks: 2,
      skips: 0,
      likes: 1
    }
  }
]);

// Sample user activity
db.user_activity.insertMany([
  {
    user_id: sample_user_ids[0],
    activity_type: "play",
    target_id: electric_sunset_id,
    target_type: "song",
    metadata: {
      context: "playlist",
      playlist_id: sample_playlist_ids[0]
    },
    timestamp: new Date("2023-09-15T10:30:00Z"),
    session_id: "session_001"
  },
  {
    user_id: sample_user_ids[0],
    activity_type: "like",
    target_id: electric_sunset_id,
    target_type: "song",
    metadata: {},
    timestamp: new Date("2023-09-15T10:34:54Z"),
    session_id: "session_001"
  },
  {
    user_id: sample_user_ids[1],
    activity_type: "follow_artist",
    target_id: luna_rodriguez_id,
    target_type: "artist",
    metadata: {},
    timestamp: new Date("2023-09-15T12:00:00Z"),
    session_id: "session_002"
  },
  {
    user_id: sample_user_ids[2],
    activity_type: "create_playlist",
    target_id: ObjectId(sample_playlist_ids[2].replace(/-/g, '').substring(0, 24)),
    target_type: "playlist",
    metadata: {
      playlist_name: "Chill Vibes"
    },
    timestamp: new Date("2023-09-14T18:00:00Z"),
    session_id: "session_003"
  }
]);

print("MongoDB sample data inserted successfully!");
print("Artists: " + db.artists.countDocuments());
print("Albums: " + db.albums.countDocuments());
print("Songs: " + db.songs.countDocuments());
print("Playlist tracks: " + db.playlist_tracks.countDocuments());
print("User statistics: " + db.user_statistics.countDocuments());
print("User recommendations: " + db.user_recommendations.countDocuments());
print("User activity: " + db.user_activity.countDocuments());