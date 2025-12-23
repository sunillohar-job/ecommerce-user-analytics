import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT ? Number(process.env.PORT) : 4000,
  mongo: {
    uri: process.env.MONGO_URI as string,
    dbName: process.env.MONGO_DB as string,
  },
};

