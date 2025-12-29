import app from './app';
import MongoDBClient from './db/mongoClient';
import { config } from './config';

const PORT = config.port;

(async () => {
  try {
    await MongoDBClient.connect();

    const server = app.listen(PORT, '0.0.0.0', () => {
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
