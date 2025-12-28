import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middlewares/errorHandler';
import { AnalyticsService } from '../services/analyticsService';
import { getDateRange } from '../utils';

const analyticsService = new AnalyticsService();

export const getTraffic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { period = '' } = req.query;

    const { start, end } = getDateRange((period as string)?.trim());

    const traffic = await analyticsService.getTraffic(start, end);
    res.json({ data: { ...traffic, start, end } });
  } catch (error) {
    next(error);
  }
};

export const getSearchKPI = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { period = '' } = req.query;

    const { start, end } = getDateRange((period as string)?.trim());

    const searchKPI = await analyticsService.getSearchKPI(start, end);
    res.json({ data: { ...searchKPI, start, end } });
  } catch (error) {
    next(error);
  }
};

export const getProductAndCartKPI = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { period = '' } = req.query;

    const { start, end } = getDateRange((period as string)?.trim());

    const productAndCartKPI = await analyticsService.getProductAndCartKPI(start, end);
    res.json({ data: { ...productAndCartKPI, start, end } });
  } catch (error) {
    next(error);
  }
};

export const getRevenueAndConversionKPI = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { period = '' } = req.query;

    const { start, end } = getDateRange((period as string)?.trim());

    const revenueAndConversionKPI = await analyticsService.getRevenueAndConversion(start, end);
    res.json({ data: { ...revenueAndConversionKPI, start, end } });
  } catch (error) {
    next(error);
  }
};

export const getUserBehaviorAndFunnelKPI = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { period = '' } = req.query;

    const { start, end } = getDateRange((period as string)?.trim());

    const userBehaviorAndFunnelKPI = await analyticsService.getUserBehaviorAndFunnelKPI(start, end);
    res.json({ data: { ...userBehaviorAndFunnelKPI, start, end } });
  } catch (error) {
    next(error);
  }
};
