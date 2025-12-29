import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../../services/analytics.service';
import { AppError } from '../../middlewares/error-handler.middleware';

jest.mock('../../services/analytics.service');

const mockAnalyticsService = {
  getTraffic: jest.fn(),
  getSearchKPI: jest.fn(),
  getProductAndCartKPI: jest.fn(),
  getRevenueAndConversion: jest.fn(),
  getUserBehaviorAndFunnelKPI: jest.fn(),
} as unknown as jest.Mocked<AnalyticsService>;

(AnalyticsService as jest.Mock).mockImplementation(() => mockAnalyticsService);

import {
  getTraffic,
  getSearchKPI,
  getProductAndCartKPI,
  getRevenueAndConversionKPI,
  getUserBehaviorAndFunnelKPI,
} from '../../controllers/analytics.controller';

describe('Analytics Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let mockJson: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn().mockReturnThis();
    mockResponse = {
      json: mockJson,
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('getTraffic', () => {
    it('should return traffic data for valid period', async () => {
      const mockTrafficData = {
        totalSessions: [{ count: 100 }],
        activeUsers: [{ count: 50 }],
        pageViewsByPage: [],
        sessionsOverTime: [],
      };

      mockRequest = {
        query: { period: 'today' },
      };
      mockAnalyticsService.getTraffic.mockResolvedValue(mockTrafficData);

      await getTraffic(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockAnalyticsService.getTraffic).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalled();
      const callArgs = mockJson.mock.calls[0][0];
      expect(callArgs.data).toMatchObject(mockTrafficData);
      expect(callArgs.data).toHaveProperty('start');
      expect(callArgs.data).toHaveProperty('end');
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      const mockError = new Error('Service error');
      mockRequest = {
        query: { period: 'today' },
      };
      mockAnalyticsService.getTraffic.mockRejectedValue(mockError);

      await getTraffic(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });

    it('should handle invalid period', async () => {
      mockRequest = {
        query: { period: 'invalid' },
      };

      await getTraffic(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    });
  });

  describe('getSearchKPI', () => {
    it('should return search KPI data', async () => {
      const mockSearchData = {
        totalSearches: [{ count: 50 }],
        topQueries: [],
        zeroResultQueries: [],
      };

      mockRequest = {
        query: { period: 'last_7_days' },
      };
      mockAnalyticsService.getSearchKPI.mockResolvedValue(mockSearchData);

      await getSearchKPI(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockAnalyticsService.getSearchKPI).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalled();
      const callArgs = mockJson.mock.calls[0][0];
      expect(callArgs.data).toMatchObject(mockSearchData);
      expect(callArgs.data).toHaveProperty('start');
      expect(callArgs.data).toHaveProperty('end');
    });

    it('should handle service errors', async () => {
      const mockError = new Error('Service error');
      mockRequest = {
        query: { period: 'last_7_days' },
      };
      mockAnalyticsService.getSearchKPI.mockRejectedValue(mockError);

      await getSearchKPI(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getProductAndCartKPI', () => {
    it('should return product and cart KPI data', async () => {
      const mockProductData = {
        cartActions: [],
        topProducts: [],
      };

      mockRequest = {
        query: { period: 'this_month' },
      };
      mockAnalyticsService.getProductAndCartKPI.mockResolvedValue(mockProductData);

      await getProductAndCartKPI(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockAnalyticsService.getProductAndCartKPI).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalled();
      const callArgs = mockJson.mock.calls[0][0];
      expect(callArgs.data).toMatchObject(mockProductData);
      expect(callArgs.data).toHaveProperty('start');
      expect(callArgs.data).toHaveProperty('end');
    });

    it('should handle service errors', async () => {
      const mockError = new Error('Service error');
      mockRequest = {
        query: { period: 'this_month' },
      };
      mockAnalyticsService.getProductAndCartKPI.mockRejectedValue(mockError);

      await getProductAndCartKPI(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getRevenueAndConversionKPI', () => {
    it('should return revenue and conversion KPI data', async () => {
      const mockRevenueData = {
        revenueStats: [],
        ordersOverTime: [],
      };

      mockRequest = {
        query: { period: 'last_month' },
      };
      mockAnalyticsService.getRevenueAndConversion.mockResolvedValue(mockRevenueData);

      await getRevenueAndConversionKPI(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockAnalyticsService.getRevenueAndConversion).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalled();
      const callArgs = mockJson.mock.calls[0][0];
      expect(callArgs.data).toMatchObject(mockRevenueData);
      expect(callArgs.data).toHaveProperty('start');
      expect(callArgs.data).toHaveProperty('end');
    });

    it('should handle service errors', async () => {
      const mockError = new Error('Service error');
      mockRequest = {
        query: { period: 'last_month' },
      };
      mockAnalyticsService.getRevenueAndConversion.mockRejectedValue(mockError);

      await getRevenueAndConversionKPI(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getUserBehaviorAndFunnelKPI', () => {
    it('should return user behavior and funnel KPI data', async () => {
      const mockBehaviorData = {
        funnel: [],
        devices: [],
      };

      mockRequest = {
        query: { period: 'this_year' },
      };
      mockAnalyticsService.getUserBehaviorAndFunnelKPI.mockResolvedValue(mockBehaviorData);

      await getUserBehaviorAndFunnelKPI(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockAnalyticsService.getUserBehaviorAndFunnelKPI).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalled();
      const callArgs = mockJson.mock.calls[0][0];
      expect(callArgs.data).toMatchObject(mockBehaviorData);
      expect(callArgs.data).toHaveProperty('start');
      expect(callArgs.data).toHaveProperty('end');
    });

    it('should handle service errors', async () => {
      const mockError = new Error('Service error');
      mockRequest = {
        query: { period: 'this_year' },
      };
      mockAnalyticsService.getUserBehaviorAndFunnelKPI.mockRejectedValue(mockError);

      await getUserBehaviorAndFunnelKPI(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
});
