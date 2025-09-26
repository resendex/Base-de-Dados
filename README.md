# Music Streaming Platform Database System

> Base de Dados Relacional com PostgreSQL e MongoDB para Plataforma de Streaming de Música

## 🎵 Project Overview

This project implements a comprehensive database system for a music streaming platform using a hybrid approach that combines the strengths of both relational (PostgreSQL) and document-based (MongoDB) databases.

### Key Features

- **📚 Music Library Management**: Complete catalog of artists, albums, and songs with rich metadata
- **👥 User Management**: Authentication, profiles, and social features
- **💳 Subscription System**: Flexible subscription plans with analytics
- **🎭 Playlist System**: Personal and collaborative playlists
- **🤖 Personalized Recommendations**: AI-driven music discovery
- **📊 Advanced Analytics**: Real-time user behavior and listening statistics

## 🏗️ Architecture

### Hybrid Database Design

| Component | Database | Purpose |
|-----------|----------|---------|
| **User Management** | PostgreSQL | Strong consistency, ACID compliance |
| **Subscriptions** | PostgreSQL | Financial integrity, complex relationships |
| **Music Library** | MongoDB | Flexible schema, rich metadata |
| **Analytics** | MongoDB | High-volume writes, complex aggregations |
| **Recommendations** | MongoDB | Dynamic content, machine learning data |

## 📁 Project Structure

```
├── postgresql/          # PostgreSQL schema and configurations
│   └── schema.sql      # Relational database schema
├── mongodb/            # MongoDB collections and indexes
│   └── schema.js       # Document database schema
├── sample-data/        # Sample data for testing
│   ├── postgresql_sample_data.sql
│   └── mongodb_sample_data.js
├── queries/            # Common queries and examples
│   ├── postgresql_queries.sql
│   └── mongodb_queries.js
└── documentation/      # Detailed documentation
    ├── architecture_overview.md
    └── setup_guide.md
```

## 🚀 Quick Start

### Prerequisites

- PostgreSQL 13+
- MongoDB 5.0+
- psql and mongosh clients

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/resendex/Base-de-Dados.git
   cd Base-de-Dados
   ```

2. **Setup PostgreSQL**
   ```bash
   # Create database
   createdb music_streaming_platform
   
   # Run schema
   psql -d music_streaming_platform -f postgresql/schema.sql
   
   # Load sample data
   psql -d music_streaming_platform -f sample-data/postgresql_sample_data.sql
   ```

3. **Setup MongoDB**
   ```bash
   # Create collections and indexes
   mongosh music_streaming_platform mongodb/schema.js
   
   # Load sample data
   mongosh music_streaming_platform sample-data/mongodb_sample_data.js
   ```

4. **Verify Installation**
   ```bash
   # Test PostgreSQL
   psql -d music_streaming_platform -c "SELECT COUNT(*) FROM users;"
   
   # Test MongoDB
   mongosh music_streaming_platform --eval "db.songs.countDocuments()"
   ```

## 💡 Key Use Cases

### 1. User and Subscription Management
- User registration and authentication
- Subscription tier management (Free, Premium, Family, Student)
- Payment processing and billing analytics
- Social features (following, sharing)

### 2. Music Library Operations
- Artist, album, and song cataloging
- Audio feature analysis (tempo, energy, danceability)
- Genre classification and tagging
- Release management and metadata

### 3. Playlist Management
- Personal playlist creation and management
- Collaborative playlists with permissions
- Public playlist discovery
- Smart playlist generation

### 4. Analytics and Recommendations
- Real-time listening statistics
- User behavior tracking
- Personalized recommendation engine
- Content performance analytics

### 5. Business Intelligence
- Subscription conversion analysis
- Revenue optimization
- User engagement metrics
- Content trend analysis

## 📊 Sample Queries

### PostgreSQL Examples

```sql
-- Get user with subscription details
SELECT u.username, sp.plan_name, us.status 
FROM users u
JOIN user_subscriptions us ON u.user_id = us.user_id
JOIN subscription_plans sp ON us.plan_id = sp.plan_id
WHERE u.username = 'musiclover123';

-- Revenue analysis by plan
SELECT sp.plan_name, COUNT(*) as subscribers, 
       SUM(sp.price_monthly) as monthly_revenue
FROM subscription_plans sp
JOIN user_subscriptions us ON sp.plan_id = us.plan_id
WHERE us.status = 'active'
GROUP BY sp.plan_id, sp.plan_name;
```

### MongoDB Examples

```javascript
// Find high-energy songs for workouts
db.songs.find({
  "audio_features.energy": { $gte: 0.8 },
  "audio_features.danceability": { $gte: 0.7 }
}).sort({ popularity_score: -1 });

// User's top artists by listening time
db.user_statistics.aggregate([
  { $match: { user_id: "user-uuid-here" } },
  { $lookup: { from: "songs", localField: "song_id", foreignField: "_id", as: "song" } },
  { $unwind: "$song" },
  { $group: { 
    _id: "$song.artist_name",
    total_time: { $sum: "$play_duration_ms" },
    play_count: { $sum: 1 }
  }},
  { $sort: { total_time: -1 } }
]);
```

## 📈 Performance Features

- **PostgreSQL Optimizations**
  - Strategic indexing on frequently queried columns
  - Automatic timestamp triggers
  - Partial indexes for filtered queries

- **MongoDB Optimizations**
  - Compound indexes for complex aggregations
  - Denormalized data for fast lookups
  - Time-based partitioning for analytics

## 🔒 Security Features

- Bcrypt password hashing with salt
- JSON Schema validation in MongoDB
- Role-based access control
- Comprehensive audit logging
- Data encryption support

## 📚 Documentation

- **[Architecture Overview](documentation/architecture_overview.md)** - Detailed system design and data flow
- **[Setup Guide](documentation/setup_guide.md)** - Complete installation and configuration
- **[Query Examples](queries/)** - Common queries for both databases

## 🤝 Contributing

This is an academic project demonstrating database design principles for a music streaming platform. The system showcases:

- Hybrid database architecture design
- ACID compliance for financial data
- Flexible document storage for content
- Real-time analytics capabilities
- Scalable recommendation systems

## 📧 Contact

This project is maintained as part of a Database Systems course, demonstrating practical application of both relational and document database technologies in a real-world scenario.

---

**Technologies**: PostgreSQL, MongoDB, SQL, JavaScript  
**Domain**: Music Streaming, Analytics, Recommendation Systems  
**Focus**: Database Design, Performance Optimization, Scalability
