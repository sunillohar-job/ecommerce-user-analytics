import MongoDBClient from '../../db/mongoClient';
import { MongoClient, Db } from 'mongodb';

// Mock mongodb module
jest.mock('mongodb');

describe('MongoDBClient', () => {
  let mockClient: jest.Mocked<MongoClient>;
  let mockDb: jest.Mocked<Db>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDb = {
      collection: jest.fn(),
    } as unknown as jest.Mocked<Db>;

    mockClient = {
      connect: jest.fn().mockResolvedValue(undefined),
      close: jest.fn().mockResolvedValue(undefined),
      db: jest.fn().mockReturnValue(mockDb),
    } as unknown as jest.Mocked<MongoClient>;

    (MongoClient as unknown as jest.Mock).mockImplementation(() => mockClient);
  });

  afterEach(() => {
    // Reset static properties
    (MongoDBClient as any).client = null;
    (MongoDBClient as any).db = null;
  });

  describe('connect', () => {
    it('should connect to MongoDB and return db instance', async () => {
      const db = await MongoDBClient.connect();
      expect(mockClient.connect).toHaveBeenCalled();
      expect(mockClient.db).toHaveBeenCalled();
      expect(db).toBe(mockDb);
    });

    it('should return existing db instance if already connected', async () => {
      await MongoDBClient.connect();
      const db2 = await MongoDBClient.connect();
      expect(mockClient.connect).toHaveBeenCalledTimes(1);
      expect(db2).toBe(mockDb);
    });
  });

  describe('getDb', () => {
    it('should return db instance when connected', async () => {
      await MongoDBClient.connect();
      const db = MongoDBClient.getDb();
      expect(db).toBe(mockDb);
    });

    it('should throw error when not connected', () => {
      expect(() => {
        MongoDBClient.getDb();
      }).toThrow('MongoDB not connected');
    });
  });

  describe('close', () => {
    it('should close connection when client exists', async () => {
      await MongoDBClient.connect();
      await MongoDBClient.close();
      expect(mockClient.close).toHaveBeenCalled();
    });
  });
});
