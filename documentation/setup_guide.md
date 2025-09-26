# Setup and Installation Guide

## Prerequisites

### System Requirements

- **PostgreSQL**: Version 13 or higher
- **MongoDB**: Version 5.0 or higher
- **Operating System**: Linux, macOS, or Windows
- **Memory**: Minimum 8GB RAM (16GB+ recommended for production)
- **Storage**: SSD storage recommended for optimal performance

### Software Dependencies

- PostgreSQL client tools (`psql`)
- MongoDB client tools (`mongosh`)
- Text editor or IDE for SQL/JavaScript development

## PostgreSQL Setup

### 1. Installation

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

#### macOS (using Homebrew)
```bash
brew install postgresql
brew services start postgresql
```

#### Windows
Download and install from [PostgreSQL official website](https://www.postgresql.org/download/)

### 2. Database Creation

```bash
# Connect to PostgreSQL as superuser
sudo -u postgres psql

# Create database and user
CREATE DATABASE music_streaming_platform;
CREATE USER music_app_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE music_streaming_platform TO music_app_user;

# Exit PostgreSQL
\q
```

### 3. Schema Setup

```bash
# Navigate to the project directory
cd /path/to/Base-de-Dados

# Create tables and indexes
psql -U music_app_user -d music_streaming_platform -f postgresql/schema.sql
```

### 4. Sample Data Loading

```bash
# Load sample data
psql -U music_app_user -d music_streaming_platform -f sample-data/postgresql_sample_data.sql
```

### 5. Verification

```bash
# Connect and verify tables
psql -U music_app_user -d music_streaming_platform

# List all tables
\dt

# Check sample data
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM subscription_plans;
```

## MongoDB Setup

### 1. Installation

#### Ubuntu/Debian
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt update
sudo apt install mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### macOS (using Homebrew)
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Windows
Download and install from [MongoDB official website](https://www.mongodb.com/try/download/community)

### 2. Database and User Setup

```bash
# Connect to MongoDB
mongosh

# Switch to admin database
use admin

# Create administrative user
db.createUser({
  user: "admin",
  pwd: "your_admin_password",
  roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
});

# Create application user
db.createUser({
  user: "music_app_user",
  pwd: "your_app_password",
  roles: [ { role: "readWrite", db: "music_streaming_platform" } ]
});
```

### 3. Schema and Collections Setup

```bash
# Load schema and create collections
mongosh --username music_app_user --password your_app_password --authenticationDatabase admin music_streaming_platform mongodb/schema.js
```

### 4. Sample Data Loading

```bash
# Load sample data
mongosh --username music_app_user --password your_app_password --authenticationDatabase admin music_streaming_platform sample-data/mongodb_sample_data.js
```

### 5. Verification

```bash
# Connect and verify collections
mongosh --username music_app_user --password your_app_password --authenticationDatabase admin music_streaming_platform

# List collections
show collections

# Check sample data
db.artists.countDocuments()
db.songs.countDocuments()
```

## Configuration

### PostgreSQL Configuration

Edit `/etc/postgresql/13/main/postgresql.conf` (path may vary):

```ini
# Memory settings
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB

# Connection settings
max_connections = 100
listen_addresses = 'localhost'

# Performance settings
random_page_cost = 1.1  # For SSD storage
effective_io_concurrency = 200  # For SSD storage
```

### MongoDB Configuration

Edit `/etc/mongod.conf`:

```yaml
# Network interfaces
net:
  port: 27017
  bindIp: 127.0.0.1

# Storage
storage:
  dbPath: /var/lib/mongodb
  journal:
    enabled: true
  wiredTiger:
    engineConfig:
      cacheSizeGB: 1

# Security
security:
  authorization: enabled

# Replication (for production)
replication:
  replSetName: music_streaming_rs
```

## Testing the Setup

### PostgreSQL Test Queries

```bash
# Navigate to queries directory
cd /path/to/Base-de-Dados/queries

# Run test queries
psql -U music_app_user -d music_streaming_platform -f postgresql_queries.sql
```

### MongoDB Test Queries

```bash
# Run test queries
mongosh --username music_app_user --password your_app_password --authenticationDatabase admin music_streaming_platform mongodb_queries.js
```

## Production Considerations

### Security

1. **Change Default Passwords**: Use strong, unique passwords
2. **Enable SSL/TLS**: Configure encrypted connections
3. **Firewall Configuration**: Restrict database access to application servers
4. **Regular Updates**: Keep databases updated with security patches

### Performance Tuning

#### PostgreSQL
```sql
-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM users WHERE username = 'musiclover123';

-- Update table statistics
ANALYZE users;

-- Vacuum tables regularly
VACUUM ANALYZE users;
```

#### MongoDB
```javascript
// Check index usage
db.songs.find({artist_name: "The Midnight Symphony"}).explain("executionStats")

// Compact collections
db.user_statistics.compact()

// Reindex collections
db.songs.reIndex()
```

### Backup Strategies

#### PostgreSQL Backup
```bash
# Full database backup
pg_dump -U music_app_user -h localhost music_streaming_platform > backup_$(date +%Y%m%d).sql

# Compressed backup
pg_dump -U music_app_user -h localhost music_streaming_platform | gzip > backup_$(date +%Y%m%d).sql.gz
```

#### MongoDB Backup
```bash
# Full database backup
mongodump --username music_app_user --password your_app_password --authenticationDatabase admin --db music_streaming_platform --out backup_$(date +%Y%m%d)

# Compressed backup
mongodump --username music_app_user --password your_app_password --authenticationDatabase admin --db music_streaming_platform --gzip --out backup_$(date +%Y%m%d)
```

### Monitoring

#### PostgreSQL Monitoring
```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- Monitor slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

#### MongoDB Monitoring
```javascript
// Check database statistics
db.stats()

// Monitor slow operations
db.setProfilingLevel(2, { slowms: 100 })
db.system.profile.find().sort({$natural: -1}).limit(5)
```

## Troubleshooting

### Common Issues

#### PostgreSQL Connection Issues
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check logs
tail -f /var/log/postgresql/postgresql-13-main.log
```

#### MongoDB Connection Issues
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Check logs
tail -f /var/log/mongodb/mongod.log
```

### Performance Issues

1. **Slow Queries**: Use EXPLAIN/explain() to analyze query plans
2. **High Memory Usage**: Adjust buffer sizes and cache settings
3. **Lock Contention**: Monitor active transactions and optimize queries
4. **Disk Space**: Regular maintenance and archival of old data

This setup guide provides a comprehensive foundation for deploying the music streaming platform database system in both development and production environments.