// MongoDB initialization script for Docker
// This script sets up the initial user and loads schema and sample data

// Switch to the music streaming database
db = db.getSiblingDB('music_streaming_platform');

// Create application user with read/write permissions
db.createUser({
  user: 'music_app_user',
  pwd: 'music_secure_password',
  roles: [
    {
      role: 'readWrite',
      db: 'music_streaming_platform'
    }
  ]
});

print('MongoDB user created successfully');

// Load the schema (collections will be created when first document is inserted)
// Note: In a real deployment, you would load the schema.js and sample data here
// For this example, we'll create a simple collection to verify the setup

// Create a simple test collection
db.test.insertOne({
  message: "MongoDB initialization completed",
  timestamp: new Date(),
  status: "ready"
});

print('MongoDB initialization completed');