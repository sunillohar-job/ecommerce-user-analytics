import { MongoClient, Db, ServerApiVersion } from 'mongodb';
import { config } from '../config';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

export default class MongoDBClient {
  private static client: MongoClient | null = null;
  private static db: Db | null = null;

  static async connect(): Promise<Db> {
    if (this.db) return this.db;

    let uri = config?.mongo?.uri;
    const dbName = config?.mongo?.dbName;

    if (config?.env === 'production') {
      const client = new SecretsManagerClient({
        region: 'ap-south-1',
      });
      const keys = await client.send(
        new GetSecretValueCommand({
          SecretId: config?.mongo?.secret_name,
        }),
      );
      uri = JSON.parse(keys?.SecretString || '{}')?.MONGO_URI || '';
    }

    this.client = new MongoClient(encodeURI(uri), {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    await this.client.connect();
    await this.client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
    this.db = this.client.db(dbName);
    // eslint-disable-next-line no-console
    console.log(`Connected to MongoDB at using DB '${dbName}'`);
    return this.db;
  }

  static getDb(): Db {
    if (!this.db) {
      throw new Error('MongoDB not connected. Call MongoDBClient.connect() first.');
    }
    return this.db;
  }

  static async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      console.log('MongoDB connection closed');
    }
  }
}
