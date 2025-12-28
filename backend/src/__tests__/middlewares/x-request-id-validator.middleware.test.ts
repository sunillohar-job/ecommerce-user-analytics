import { Request, Response, NextFunction } from 'express';
import { xRequestIdValidator } from '../../middlewares/x-request-id-validator.middleware';
import { AppError } from '../../middlewares/error-handler.middleware';

describe('X-Request-ID Validator Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockNext = jest.fn();
    mockRequest = {
      get: jest.fn(),
    };
    mockResponse = {};
  });

  it('should call next() when x-request-id header is present and non-empty', () => {
    (mockRequest.get as jest.Mock).mockReturnValue('valid-request-id');
    xRequestIdValidator(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockNext).toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('should throw AppError when x-request-id header is missing', () => {
    (mockRequest.get as jest.Mock).mockReturnValue(undefined);
    expect(() => {
      xRequestIdValidator(mockRequest as Request, mockResponse as Response, mockNext);
    }).toThrow(AppError);
    expect(mockNext).not.toHaveBeenCalled();
  });
});

