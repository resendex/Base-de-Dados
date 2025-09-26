// Music Streaming Platform - MongoDB Schema
// Handles document-based data: music library, recommendations, statistics

// Use the music streaming database
use music_streaming_platform;

// Artists collection
db.createCollection("artists", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "created_at"],
      properties: {
        _id: {
          bsonType: "objectId"
        },
        name: {
          bsonType: "string",
          description: "Artist name is required"
        },
        biography: {
          bsonType: "string",
          description: "Artist biography"
        },
        genres: {
          bsonType: "array",
          items: {
            bsonType: "string"
          },
          description: "List of genres associated with the artist"
        },
        country: {
          bsonType: "string",
          description: "Artist's country of origin"
        },
        profile_image_url: {
          bsonType: "string",
          description: "URL to artist profile image"
        },
        social_media: {
          bsonType: "object",
          properties: {
            spotify: { bsonType: "string" },
            youtube: { bsonType: "string" },
            instagram: { bsonType: "string" },
            twitter: { bsonType: "string" }
          }
        },
        monthly_listeners: {
          bsonType: "int",
          minimum: 0,
          description: "Current monthly listeners count"
        },
        verified: {
          bsonType: "bool",
          description: "Whether the artist is verified"
        },
        created_at: {
          bsonType: "date",
          description: "Creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Last update timestamp"
        }
      }
    }
  }
});

// Albums collection
db.createCollection("albums", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "artist_id", "release_date", "created_at"],
      properties: {
        _id: {
          bsonType: "objectId"
        },
        title: {
          bsonType: "string",
          description: "Album title is required"
        },
        artist_id: {
          bsonType: "objectId",
          description: "Reference to artist document"
        },
        artist_name: {
          bsonType: "string",
          description: "Artist name for denormalization"
        },
        release_date: {
          bsonType: "date",
          description: "Album release date"
        },
        genre: {
          bsonType: "array",
          items: {
            bsonType: "string"
          }
        },
        cover_image_url: {
          bsonType: "string"
        },
        label: {
          bsonType: "string",
          description: "Record label"
        },
        total_tracks: {
          bsonType: "int",
          minimum: 1
        },
        total_duration_ms: {
          bsonType: "long",
          minimum: 0
        },
        album_type: {
          bsonType: "string",
          enum: ["album", "single", "compilation", "ep"],
          description: "Type of album"
        },
        explicit: {
          bsonType: "bool",
          description: "Contains explicit content"
        },
        popularity_score: {
          bsonType: "double",
          minimum: 0,
          maximum: 100
        },
        created_at: {
          bsonType: "date"
        },
        updated_at: {
          bsonType: "date"
        }
      }
    }
  }
});

// Songs collection
db.createCollection("songs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "artist_id", "duration_ms", "created_at"],
      properties: {
        _id: {
          bsonType: "objectId"
        },
        title: {
          bsonType: "string",
          description: "Song title is required"
        },
        artist_id: {
          bsonType: "objectId",
          description: "Primary artist ID"
        },
        artist_name: {
          bsonType: "string",
          description: "Primary artist name for denormalization"
        },
        collaborating_artists: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              artist_id: { bsonType: "objectId" },
              artist_name: { bsonType: "string" },
              role: { bsonType: "string" } // featuring, remix, etc.
            }
          }
        },
        album_id: {
          bsonType: "objectId",
          description: "Reference to album (optional for singles)"
        },
        album_name: {
          bsonType: "string"
        },
        track_number: {
          bsonType: "int",
          minimum: 1
        },
        duration_ms: {
          bsonType: "long",
          minimum: 1000,
          description: "Duration in milliseconds"
        },
        genres: {
          bsonType: "array",
          items: {
            bsonType: "string"
          }
        },
        release_date: {
          bsonType: "date"
        },
        explicit: {
          bsonType: "bool"
        },
        popularity_score: {
          bsonType: "double",
          minimum: 0,
          maximum: 100
        },
        audio_features: {
          bsonType: "object",
          properties: {
            danceability: { bsonType: "double", minimum: 0, maximum: 1 },
            energy: { bsonType: "double", minimum: 0, maximum: 1 },
            valence: { bsonType: "double", minimum: 0, maximum: 1 },
            tempo: { bsonType: "double", minimum: 0 },
            key: { bsonType: "int", minimum: -1, maximum: 11 },
            mode: { bsonType: "int", enum: [0, 1] },
            time_signature: { bsonType: "int", minimum: 3, maximum: 7 }
          }
        },
        lyrics: {
          bsonType: "string"
        },
        file_urls: {
          bsonType: "object",
          properties: {
            preview: { bsonType: "string" },
            low_quality: { bsonType: "string" },
            standard_quality: { bsonType: "string" },
            high_quality: { bsonType: "string" },
            lossless: { bsonType: "string" }
          }
        },
        created_at: {
          bsonType: "date"
        },
        updated_at: {
          bsonType: "date"
        }
      }
    }
  }
});

// Playlist tracks collection (flexible playlist content)
db.createCollection("playlist_tracks", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["playlist_id", "song_id", "added_at"],
      properties: {
        _id: {
          bsonType: "objectId"
        },
        playlist_id: {
          bsonType: "string",
          description: "UUID from PostgreSQL playlists table"
        },
        song_id: {
          bsonType: "objectId",
          description: "Reference to song document"
        },
        song_title: {
          bsonType: "string",
          description: "Denormalized song title"
        },
        artist_name: {
          bsonType: "string",
          description: "Denormalized artist name"
        },
        position: {
          bsonType: "int",
          minimum: 0,
          description: "Position in playlist"
        },
        added_by: {
          bsonType: "string",
          description: "UUID of user who added the track"
        },
        added_at: {
          bsonType: "date"
        }
      }
    }
  }
});

// User listening statistics
db.createCollection("user_statistics", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "song_id", "created_at"],
      properties: {
        _id: {
          bsonType: "objectId"
        },
        user_id: {
          bsonType: "string",
          description: "UUID from PostgreSQL users table"
        },
        song_id: {
          bsonType: "objectId"
        },
        artist_id: {
          bsonType: "objectId"
        },
        album_id: {
          bsonType: "objectId"
        },
        play_duration_ms: {
          bsonType: "long",
          minimum: 0,
          description: "How long the user listened"
        },
        completion_percentage: {
          bsonType: "double",
          minimum: 0,
          maximum: 100
        },
        skip_time_ms: {
          bsonType: "long",
          description: "Time when user skipped (0 if completed)"
        },
        device_type: {
          bsonType: "string",
          enum: ["mobile", "desktop", "web", "smart_speaker", "tv"]
        },
        shuffle_mode: {
          bsonType: "bool"
        },
        repeat_mode: {
          bsonType: "string",
          enum: ["off", "track", "context"]
        },
        created_at: {
          bsonType: "date"
        }
      }
    }
  }
});

// User recommendations
db.createCollection("user_recommendations", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "recommendations", "generated_at"],
      properties: {
        _id: {
          bsonType: "objectId"
        },
        user_id: {
          bsonType: "string",
          description: "UUID from PostgreSQL users table"
        },
        recommendation_type: {
          bsonType: "string",
          enum: ["daily_mix", "discover_weekly", "release_radar", "similar_artists", "mood_based"]
        },
        recommendations: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              song_id: { bsonType: "objectId" },
              score: { bsonType: "double", minimum: 0, maximum: 1 },
              reason: { bsonType: "string" }
            }
          }
        },
        based_on: {
          bsonType: "object",
          properties: {
            listening_history: { bsonType: "bool" },
            liked_songs: { bsonType: "bool" },
            followed_artists: { bsonType: "bool" },
            similar_users: { bsonType: "bool" },
            mood_analysis: { bsonType: "bool" }
          }
        },
        generated_at: {
          bsonType: "date"
        },
        expires_at: {
          bsonType: "date"
        },
        engagement_stats: {
          bsonType: "object",
          properties: {
            views: { bsonType: "int", minimum: 0 },
            clicks: { bsonType: "int", minimum: 0 },
            skips: { bsonType: "int", minimum: 0 },
            likes: { bsonType: "int", minimum: 0 }
          }
        }
      }
    }
  }
});

// User activity logs
db.createCollection("user_activity", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "activity_type", "timestamp"],
      properties: {
        _id: {
          bsonType: "objectId"
        },
        user_id: {
          bsonType: "string"
        },
        activity_type: {
          bsonType: "string",
          enum: ["play", "pause", "skip", "like", "unlike", "add_to_playlist", "remove_from_playlist", "follow_artist", "unfollow_artist", "create_playlist", "search"]
        },
        target_id: {
          bsonType: "objectId",
          description: "ID of the target object (song, artist, playlist, etc.)"
        },
        target_type: {
          bsonType: "string",
          enum: ["song", "artist", "album", "playlist", "user"]
        },
        metadata: {
          bsonType: "object",
          description: "Additional activity-specific data"
        },
        timestamp: {
          bsonType: "date"
        },
        session_id: {
          bsonType: "string"
        }
      }
    }
  }
});

// Create indexes for better performance
// Artists indexes
db.artists.createIndex({ "name": 1 });
db.artists.createIndex({ "genres": 1 });
db.artists.createIndex({ "country": 1 });
db.artists.createIndex({ "monthly_listeners": -1 });
db.artists.createIndex({ "verified": 1 });

// Albums indexes
db.albums.createIndex({ "artist_id": 1 });
db.albums.createIndex({ "release_date": -1 });
db.albums.createIndex({ "genre": 1 });
db.albums.createIndex({ "popularity_score": -1 });
db.albums.createIndex({ "album_type": 1 });

// Songs indexes
db.songs.createIndex({ "artist_id": 1 });
db.songs.createIndex({ "album_id": 1 });
db.songs.createIndex({ "title": 1 });
db.songs.createIndex({ "genres": 1 });
db.songs.createIndex({ "popularity_score": -1 });
db.songs.createIndex({ "release_date": -1 });
db.songs.createIndex({ "duration_ms": 1 });
db.songs.createIndex({ "audio_features.danceability": 1 });
db.songs.createIndex({ "audio_features.energy": 1 });
db.songs.createIndex({ "audio_features.valence": 1 });

// Playlist tracks indexes
db.playlist_tracks.createIndex({ "playlist_id": 1, "position": 1 });
db.playlist_tracks.createIndex({ "song_id": 1 });
db.playlist_tracks.createIndex({ "added_by": 1 });
db.playlist_tracks.createIndex({ "added_at": -1 });

// User statistics indexes
db.user_statistics.createIndex({ "user_id": 1, "created_at": -1 });
db.user_statistics.createIndex({ "song_id": 1 });
db.user_statistics.createIndex({ "artist_id": 1 });
db.user_statistics.createIndex({ "created_at": -1 });
db.user_statistics.createIndex({ "completion_percentage": 1 });

// User recommendations indexes
db.user_recommendations.createIndex({ "user_id": 1, "recommendation_type": 1 });
db.user_recommendations.createIndex({ "generated_at": -1 });
db.user_recommendations.createIndex({ "expires_at": 1 });

// User activity indexes
db.user_activity.createIndex({ "user_id": 1, "timestamp": -1 });
db.user_activity.createIndex({ "activity_type": 1 });
db.user_activity.createIndex({ "target_id": 1, "target_type": 1 });
db.user_activity.createIndex({ "timestamp": -1 });

print("MongoDB schema and indexes created successfully!");