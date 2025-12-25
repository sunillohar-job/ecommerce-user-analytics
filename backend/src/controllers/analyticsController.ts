import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middlewares/errorHandler';
import { AnalyticsService } from '../services/analyticsService';
import { getDateRange } from '../utils';

const analyticsService = new AnalyticsService();

export const getTraffic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { period = '' } = req.query;
    if (typeof period !== 'string' || period.trim() === '') {
      throw new AppError({
        message: 'Query parameter "period" must be a non-empty string',
        status: 400,
      });
    }

    const { start, end } = getDateRange(period);

    const traffic = await analyticsService.getTraffic(start, end);
    res.json({ data: traffic });
  } catch (error) {
    next(error);
  }
};
