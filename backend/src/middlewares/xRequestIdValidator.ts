import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export function xRequestIdValidator(req: Request, res: Response, next: NextFunction) {
  const requestId = req.get('x-request-id');
  if (!requestId || requestId?.trim() === '') {
    throw new AppError({
      message: 'Missing required request header: "x-request-id"',
      status: 400,
    });
  }
  next();
}
