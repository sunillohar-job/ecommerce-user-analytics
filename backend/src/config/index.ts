import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT ? Number(process.env.PORT) : 4000,
  env: process.env.NODE_ENV || 'local',
  mongo: {
    uri: process.env.MONGO_URI as string,
    dbName: process.env.MONGO_DB as string,
    secret_name:  process.env.AWS_SECRET_NAME as string,
  },
  collections: {
    USERS: 'users',
    EVENTS: 'events',
    SESSIONS: 'sessions',
  },
};
