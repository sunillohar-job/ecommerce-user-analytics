// Test setup file
// This file runs before all tests

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'silent';
process.env.PORT = '4000';
process.env.MONGO_URI = 'mongodb://localhost:27017/test';
process.env.MONGO_DB = 'test_db';
