/* eslint-disable @typescript-eslint/no-explicit-any */
import { UsersService } from '../../services/users.service';
import MongoDBClient from '../../db/mongoClient';

// Mock MongoDBClient
jest.mock('../../db/mongoClient');
jest.mock('../../config', () => ({
  config: {
    collections: {
      USERS: 'users',
      SESSIONS: 'sessions',
      EVENTS: 'events',
    },
  },
}));

describe('UsersService', () => {
  let usersService: UsersService;
  let mockCollection: any;
  let mockDb: any;

  beforeEach(() => {
    usersService = new UsersService();
    mockCollection = {
      aggregate: jest.fn(),
      find: jest.fn(),
      limit: jest.fn(),
      toArray: jest.fn(),
    };
    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection),
    };
    (MongoDBClient.getDb as jest.Mock) = jest.fn().mockReturnValue(mockDb);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getJourneys', () => {
    it('should return user journeys for valid date range', async () => {
      const mockJourneyData = {
        totalSessions: 5,
        orderPlacedSessions: 2,
        totalEvents: 50,
        totalPurchaseAmount: 1000.5,
        totalPurchaseQuantity: 10,
        conversionRate: 40.0,
        sessions: [],
      };

      const mockAggregate = {
        next: jest.fn().mockResolvedValue(mockJourneyData),
      };
      mockCollection.aggregate.mockReturnValue(mockAggregate);

      const result = await usersService.getJourneys('user123', '2023-01-01', '2023-01-31');

      expect(mockDb.collection).toHaveBeenCalledWith('sessions');
      expect(mockCollection.aggregate).toHaveBeenCalled();
      expect(result).toEqual(mockJourneyData);
    });

    it('should return null when no journeys found', async () => {
      const mockAggregate = {
        next: jest.fn().mockResolvedValue(null),
      };
      mockCollection.aggregate.mockReturnValue(mockAggregate);

      const result = await usersService.getJourneys('user123', '2023-01-01', '2023-01-31');

      expect(result).toBeNull();
    });

    it('should handle errors from database', async () => {
      const mockError = new Error('Database error');
      const mockAggregate = {
        next: jest.fn().mockRejectedValue(mockError),
      };
      mockCollection.aggregate.mockReturnValue(mockAggregate);

      await expect(usersService.getJourneys('user123', '2023-01-01', '2023-01-31')).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('searchUsers', () => {
    it('should search users by query string', async () => {
      const mockUsers = [
        {
          userId: 'user1',
          fname: 'John',
          lname: 'Doe',
          age: 30,
          country: 'US',
          language: 'en',
          createdAt: '2023-01-01',
          lastActiveAt: '2023-01-15',
        },
      ];

      const mockFindChain = {
        limit: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue(mockUsers),
      };
      mockCollection.find.mockReturnValue(mockFindChain);

      const result = await usersService.searchUsers('john', 10);

      expect(mockDb.collection).toHaveBeenCalledWith('users');
      expect(mockCollection.find).toHaveBeenCalledWith({
        $or: [
          { userId: { $regex: 'john', $options: 'i' } },
          { fname: { $regex: 'john', $options: 'i' } },
          { lname: { $regex: 'john', $options: 'i' } },
        ],
      });
      expect(mockFindChain.limit).toHaveBeenCalledWith(10);
      expect(result).toEqual(mockUsers);
    });

    it('should return empty array when no users found', async () => {
      const mockFindChain = {
        limit: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue([]),
      };
      mockCollection.find.mockReturnValue(mockFindChain);

      const result = await usersService.searchUsers('nonexistent', 10);

      expect(result).toEqual([]);
    });

    it('should handle errors from database', async () => {
      const mockError = new Error('Database error');
      const mockFindChain = {
        limit: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockRejectedValue(mockError),
      };
      mockCollection.find.mockReturnValue(mockFindChain);

      await expect(usersService.searchUsers('test', 10)).rejects.toThrow('Database error');
    });
  });
});
