import dotenv from 'dotenv';
import app from './app';
import MongoDBClient from './db/mongoClient';

dotenv.config({
  path: process.env.NODE_ENV === 'development' ? '.env' : '.env.production',
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

(async () => {
  try {
    await MongoDBClient.connect();

    const server = app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Backend listening on port ${PORT}`);
    });

    const shutdown = async () => {
      // eslint-disable-next-line no-console
      console.log('Shutting down...');
      server.close();
      await MongoDBClient.close();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to start application', err);
    process.exit(1);
  }
})();
