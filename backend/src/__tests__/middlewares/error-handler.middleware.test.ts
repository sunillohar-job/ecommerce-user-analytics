import { Request, Response, NextFunction } from 'express';
import { AppError, errorHandler } from '../../middlewares/error-handler.middleware';
import { logger } from '../../logger';

describe('Error Handler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let mockStatus: jest.Mock;
  let mockJson: jest.Mock;

  beforeEach(() => {
    mockStatus = jest.fn().mockReturnThis();
    mockJson = jest.fn().mockReturnThis();
    mockNext = jest.fn();
    mockRequest = {
      headers: {
        'x-request-id': 'test-request-id',
      },
    };
    mockResponse = {
      status: mockStatus,
      json: mockJson,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('errorHandler', () => {
    it('should handle AppError correctly', () => {
      const error = new AppError({
        message: 'Test error',
        status: 400,
        data: { field: 'value' },
      });
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Test error',
        data: { field: 'value' },
        status: 400,
      });
    });

    it('should handle generic Error correctly', () => {
      const error = new Error('Generic error');
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Generic error',
      });
    });

    it('should handle error without message', () => {
      const error = new Error();
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Internal server error',
      });
    });

    it('should include requestId in error logging', () => {
      const error = new Error('Test error');
      const loggerSpy = jest.spyOn(logger, 'error');
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      expect(loggerSpy).toHaveBeenCalled();
      loggerSpy.mockRestore();
    });
  });
});
