import { Request, Response, NextFunction } from 'express';
import { periodQueryValidator } from '../../middlewares/period-query-validator.middleware';
import { AppError } from '../../middlewares/error-handler.middleware';

describe('Period Query Validator Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockNext = jest.fn();
    mockRequest = {
      query: {},
    };
    mockResponse = {};
  });

  it('should call next() when period is a valid non-empty string', () => {
    mockRequest.query = { period: 'today' };
    periodQueryValidator(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockNext).toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('should throw AppError when period is missing', () => {
    mockRequest.query = {};
    periodQueryValidator(mockRequest as Request, mockResponse as Response, mockNext)
    expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
  });
});
