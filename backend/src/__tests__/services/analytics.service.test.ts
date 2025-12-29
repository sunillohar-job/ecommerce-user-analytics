/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnalyticsService } from '../../services/analytics.service';
import MongoDBClient from '../../db/mongoClient';

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

describe('AnalyticsService', () => {
  let analyticsService: AnalyticsService;
  let mockCollection: any;
  let mockDb: any;

  beforeEach(() => {
    analyticsService = new AnalyticsService();
    mockCollection = {
      aggregate: jest.fn(),
    };
    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection),
    };
    (MongoDBClient.getDb as jest.Mock) = jest.fn().mockReturnValue(mockDb);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTraffic', () => {
    it('should return traffic analytics data', async () => {
      const mockTrafficData = {
        totalSessions: [{ count: 100 }],
        activeUsers: [{ count: 50 }],
        pageViewsByPage: [{ page: '/home', views: 200 }],
        sessionsOverTime: [{ date: '2023-01-01', sessions: 10 }],
      };

      const mockAggregate = {
        next: jest.fn().mockResolvedValue(mockTrafficData),
      };
      mockCollection.aggregate.mockReturnValue(mockAggregate);

      const start = new Date('2023-01-01');
      const end = new Date('2023-01-31');
      const result = await analyticsService.getTraffic(start, end);

      expect(mockDb.collection).toHaveBeenCalledWith('sessions');
      expect(mockCollection.aggregate).toHaveBeenCalled();
      expect(result).toEqual(mockTrafficData);
    });

    it('should return null when no data found', async () => {
      const mockAggregate = {
        next: jest.fn().mockResolvedValue(null),
      };
      mockCollection.aggregate.mockReturnValue(mockAggregate);

      const start = new Date('2023-01-01');
      const end = new Date('2023-01-31');
      const result = await analyticsService.getTraffic(start, end);

      expect(result).toBeNull();
    });
  });

  describe('getSearchKPI', () => {
    it('should return search analytics data', async () => {
      const mockSearchData = {
        totalSearches: [{ count: 50 }],
        topQueries: [{ query: 'laptop', searches: 20 }],
        zeroResultQueries: [{ query: 'xyz', searches: 5 }],
      };

      const mockAggregate = {
        next: jest.fn().mockResolvedValue(mockSearchData),
      };
      mockCollection.aggregate.mockReturnValue(mockAggregate);

      const start = new Date('2023-01-01');
      const end = new Date('2023-01-31');
      const result = await analyticsService.getSearchKPI(start, end);

      expect(mockDb.collection).toHaveBeenCalledWith('events');
      expect(result).toEqual(mockSearchData);
    });
  });

  describe('getProductAndCartKPI', () => {
    it('should return product and cart analytics data', async () => {
      const mockProductData = {
        cartActions: [
          { eventType: 'ADD_TO_CART', count: 30 },
          { eventType: 'REMOVE_FROM_CART', count: 5 },
        ],
        topProducts: [{ productId: 'prod1', name: 'Product 1', quantity: 10 }],
      };

      const mockAggregate = {
        next: jest.fn().mockResolvedValue(mockProductData),
      };
      mockCollection.aggregate.mockReturnValue(mockAggregate);

      const start = new Date('2023-01-01');
      const end = new Date('2023-01-31');
      const result = await analyticsService.getProductAndCartKPI(start, end);

      expect(mockDb.collection).toHaveBeenCalledWith('events');
      expect(result).toEqual(mockProductData);
    });
  });

  describe('getRevenueAndConversion', () => {
    it('should return revenue and conversion analytics data', async () => {
      const mockRevenueData = {
        revenueStats: [
          {
            revenue: 5000.5,
            orders: 100,
            avgOrderValue: 50.01,
          },
        ],
        ordersOverTime: [{ date: '2023-01-01', orders: 10 }],
      };

      const mockAggregate = {
        next: jest.fn().mockResolvedValue(mockRevenueData),
      };
      mockCollection.aggregate.mockReturnValue(mockAggregate);

      const start = new Date('2023-01-01');
      const end = new Date('2023-01-31');
      const result = await analyticsService.getRevenueAndConversion(start, end);

      expect(mockDb.collection).toHaveBeenCalledWith('events');
      expect(result).toEqual(mockRevenueData);
    });
  });

  describe('getUserBehaviorAndFunnelKPI', () => {
    it('should return user behavior and funnel analytics data', async () => {
      const mockBehaviorData = {
        funnel: [
          { eventType: 'PAGE_VIEW_OR_SEARCH', uniqueUsersCount: 100 },
          { eventType: 'ADD_TO_CART', uniqueUsersCount: 50 },
          { eventType: 'ORDER_PLACED', uniqueUsersCount: 20 },
        ],
        devices: [
          { device: 'mobile', uniqueUsersCount: 60 },
          { device: 'desktop', uniqueUsersCount: 40 },
        ],
      };

      const mockAggregate = {
        next: jest.fn().mockResolvedValue(mockBehaviorData),
      };
      mockCollection.aggregate.mockReturnValue(mockAggregate);

      const start = new Date('2023-01-01');
      const end = new Date('2023-01-31');
      const result = await analyticsService.getUserBehaviorAndFunnelKPI(start, end);

      expect(mockDb.collection).toHaveBeenCalledWith('events');
      expect(result).toEqual(mockBehaviorData);
    });
  });
});
