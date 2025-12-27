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
    res.json({ data: { ...traffic, start, end } });
  } catch (error) {
    next(error);
  }
};

export const getSearchKPI = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { period = '' } = req.query;
    if (typeof period !== 'string' || period.trim() === '') {
      throw new AppError({
        message: 'Query parameter "period" must be a non-empty string',
        status: 400,
      });
    }

    const { start, end } = getDateRange(period);

    const searchKPI = await analyticsService.getSearchKPI(start, end);
    res.json({ data: { ...searchKPI, start, end } });
  } catch (error) {
    next(error);
  }
};

export const getProductAndCartKPI = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { period = '' } = req.query;
    if (typeof period !== 'string' || period.trim() === '') {
      throw new AppError({
        message: 'Query parameter "period" must be a non-empty string',
        status: 400,
      });
    }

    const { start, end } = getDateRange(period);

    const productAndCartKPI = await analyticsService.getProductAndCartKPI(start, end);
    res.json({ data: { ...productAndCartKPI, start, end } });
  } catch (error) {
    next(error);
  }
};

export const getRevenueAndConversion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { period = '' } = req.query;
    if (typeof period !== 'string' || period.trim() === '') {
      throw new AppError({
        message: 'Query parameter "period" must be a non-empty string',
        status: 400,
      });
    }

    const { start, end } = getDateRange(period);

    const revenueAndConversionKPI = await analyticsService.getRevenueAndConversion(start, end);
    res.json({ data: { ...revenueAndConversionKPI, start, end } });
  } catch (error) {
    next(error);
  }
};
