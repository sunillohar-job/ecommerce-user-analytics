/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../../services/users.service';
import { AppError } from '../../middlewares/error-handler.middleware';

jest.mock('../../services/users.service');

const mockUsersService = {
  getJourneys: jest.fn(),
  searchUsers: jest.fn(),
} as unknown as jest.Mocked<UsersService>;

(UsersService as jest.Mock).mockImplementation(() => mockUsersService);

import { getUserJourneys, searchUsers } from '../../controllers/users.controller';

describe('Users Controller', () => {
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

  describe('getUserJourneys', () => {
    it('should return user journeys for valid dates', async () => {
      const mockJourneyData = {
        totalSessions: 5,
        sessions: [],
        totalPurchaseAmount: 1000,
        totalPurchaseQuantity: 10,
      };

      mockRequest = {
        params: { userId: 'user123' },
        query: { from: '2023-01-01', to: '2023-01-31' },
      };
      mockUsersService.getJourneys.mockResolvedValue(mockJourneyData);

      await getUserJourneys(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockUsersService.getJourneys).toHaveBeenCalledWith(
        'user123',
        '2023-01-01',
        '2023-01-31',
      );
      expect(mockJson).toHaveBeenCalledWith({ data: mockJourneyData });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return default data when journeys is null', async () => {
      mockRequest = {
        params: { userId: 'user123' },
        query: { from: '2023-01-01', to: '2023-01-31' },
      };
      mockUsersService.getJourneys.mockResolvedValue(null);

      await getUserJourneys(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockJson).toHaveBeenCalledWith({
        data: {
          sessions: [],
          totalPurchaseAmount: 0,
          totalPurchaseItems: 0,
        },
      });
    });

    it('should call next with AppError for invalid from date', async () => {
      mockRequest = {
        params: { userId: 'user123' },
        query: { from: 'invalid-date', to: '2023-01-31' },
      };

      await getUserJourneys(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockUsersService.getJourneys).not.toHaveBeenCalled();
    });
  });

  describe('searchUsers', () => {
    it('should return users for valid query', async () => {
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

      mockRequest = {
        query: { query: 'john', limit: '10' },
      };
      mockUsersService.searchUsers.mockResolvedValue(mockUsers);

      await searchUsers(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockUsersService.searchUsers).toHaveBeenCalledWith('john', 10);
      expect(mockJson).toHaveBeenCalledWith({ data: mockUsers });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should use default limit when not provided', async () => {
      const mockUsers: any[] = [];
      mockRequest = {
        query: { query: 'test' },
      };
      mockUsersService.searchUsers.mockResolvedValue(mockUsers);

      await searchUsers(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockUsersService.searchUsers).toHaveBeenCalledWith('test', 10);
    });

    it('should call next with AppError for empty query', async () => {
      mockRequest = {
        query: { query: '', limit: '10' },
      };

      await searchUsers(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockUsersService.searchUsers).not.toHaveBeenCalled();
    });

    it('should call next with AppError for invalid or negative limit', async () => {
      mockRequest = {
        query: { query: 'test', limit: '-5' },
      };

      await searchUsers(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    });

    it('should handle service errors', async () => {
      const mockError = new Error('Service error');
      mockRequest = {
        query: { query: 'test', limit: '10' },
      };
      mockUsersService.searchUsers.mockRejectedValue(mockError);

      await searchUsers(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
});
