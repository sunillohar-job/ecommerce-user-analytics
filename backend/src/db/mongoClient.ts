import { MongoClient, Db } from 'mongodb';
import { config } from '../config';

export default class MongoDBClient {
  private static client: MongoClient | null = null;
  private static db: Db | null = null;

  static async connect(): Promise<Db> {
    if (this.db) return this.db;

    const uri = config.mongo.uri;
    const dbName = config.mongo.dbName;

    this.client = new MongoClient(uri);
    await this.client.connect();

    this.db = this.client.db(dbName);
    // eslint-disable-next-line no-console
    console.log(`Connected to MongoDB at ${uri}, using DB '${dbName}'`);
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
      // eslint-disable-next-line no-console
      console.log('MongoDB connection closed');
    }
  }
}
