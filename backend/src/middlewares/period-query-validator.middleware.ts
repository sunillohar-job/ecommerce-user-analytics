import { Request, Response, NextFunction } from 'express';
import { AppError } from './error-handler.middleware';

export function periodQueryValidator(req: Request, res: Response, next: NextFunction) {
  const { period = '' } = req.query;
  if (typeof period !== 'string' || period.trim() === '') {
    return next(
      new AppError({
        message: 'Query parameter "period" must be a non-empty string',
        status: 400,
      }),
    );
  }
  next();
}
