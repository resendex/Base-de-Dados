# Docker Deployment Guide

## Quick Start with Docker Compose

The easiest way to run the music streaming database system is using Docker Compose, which sets up both PostgreSQL and MongoDB with all the necessary configurations.

### Prerequisites

- Docker and Docker Compose installed
- At least 4GB of available RAM
- 10GB of free disk space

### Starting the Services

```bash
# Clone the repository
git clone https://github.com/resendex/Base-de-Dados.git
cd Base-de-Dados

# Start all services
docker-compose up -d

# Check service status
docker-compose ps
```

### Services Included

| Service | Port | Description |
|---------|------|-------------|
| PostgreSQL | 5432 | Main relational database |
| MongoDB | 27017 | Document database |
| pgAdmin | 8080 | PostgreSQL web interface |
| Mongo Express | 8081 | MongoDB web interface |

### Default Credentials

#### PostgreSQL
- **Database**: `music_streaming_platform`
- **User**: `music_app_user`
- **Password**: `music_secure_password`

#### MongoDB
- **Database**: `music_streaming_platform`
- **Admin User**: `admin`
- **Admin Password**: `admin_secure_password`
- **App User**: `music_app_user`
- **App Password**: `music_secure_password`

#### Web Interfaces
- **pgAdmin**: admin@musicstreaming.com / pgadmin_secure_password
- **Mongo Express**: Uses MongoDB admin credentials

### Loading Schema and Data

After the containers are running, load the MongoDB schema and sample data:

```bash
# Load MongoDB schema
docker exec -i music_streaming_mongodb mongosh music_streaming_platform --username music_app_user --password music_secure_password --authenticationDatabase music_streaming_platform < mongodb/schema.js

# Load MongoDB sample data
docker exec -i music_streaming_mongodb mongosh music_streaming_platform --username music_app_user --password music_secure_password --authenticationDatabase music_streaming_platform < sample-data/mongodb_sample_data.js
```

The PostgreSQL schema and sample data are automatically loaded during container initialization.

### Testing the Setup

```bash
# Test PostgreSQL connection
docker exec -it music_streaming_postgres psql -U music_app_user -d music_streaming_platform -c "SELECT COUNT(*) FROM users;"

# Test MongoDB connection
docker exec -it music_streaming_mongodb mongosh music_streaming_platform --username music_app_user --password music_secure_password --authenticationDatabase music_streaming_platform --eval "db.songs.countDocuments()"
```

### Accessing Web Interfaces

- **pgAdmin**: http://localhost:8080
- **Mongo Express**: http://localhost:8081

### Managing the Environment

```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes (WARNING: This deletes all data)
docker-compose down -v

# Update containers
docker-compose pull
docker-compose up -d
```

### Production Considerations

For production deployment, modify the following:

1. **Change all default passwords**
2. **Use environment files for secrets**
3. **Configure SSL/TLS certificates**
4. **Set up proper backup strategies**
5. **Configure resource limits**
6. **Use external volumes for persistent storage**

### Environment Variables

Create a `.env` file to customize the configuration:

```bash
# PostgreSQL Configuration
POSTGRES_DB=music_streaming_platform
POSTGRES_USER=music_app_user
POSTGRES_PASSWORD=your_secure_password

# MongoDB Configuration  
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=your_admin_password

# Web Interface Passwords
PGADMIN_PASSWORD=your_pgadmin_password
```

### Troubleshooting

#### Common Issues

1. **Port conflicts**: Change ports in docker-compose.yml if already in use
2. **Memory issues**: Ensure Docker has sufficient memory allocated
3. **Permission errors**: Check file permissions in mounted volumes

#### Health Checks

The containers include health checks. View status with:

```bash
docker-compose ps
```

#### Logs

View detailed logs for debugging:

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs postgres
docker-compose logs mongodb
```

This Docker setup provides a complete development and testing environment for the music streaming database system.