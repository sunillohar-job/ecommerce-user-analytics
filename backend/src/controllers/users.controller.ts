import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../services/users.service';
import { AppError } from '../middlewares/error-handler.middleware';
import { isValidDate } from '../utils';

const userService = new UsersService();

export const getUserJourneys = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const { from, to } = req.query;
    const fromDate = new Date(String(from));
    const toDate = new Date(String(to));
    if (!isValidDate(fromDate) || !isValidDate(toDate)) {
      throw new AppError({
        message: 'Query parameter "from" and "to" must be valid date strings',
        status: 400,
      });
    }
    const journeys = await userService.getJourneys(userId, String(from), String(to));
    res.json(
      journeys === null
        ? {
          data: {
            sessions: [],
            totalPurchaseAmount: 0,
            totalPurchaseItems: 0,
          },
        }
        : { data: journeys },
    );
  } catch (error) {
    next(error);
  }
};

export const searchUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query = '', limit = 10 } = req.query;
    if (typeof query !== 'string' || query.trim() === '') {
      throw new AppError({
        message: 'Query parameter "query" must be a non-empty string',
        status: 400,
      });
    }
    if (isNaN(Number(limit)) || Number(limit) <= 0) {
      throw new AppError({
        message: 'Query parameter "limit" must be a positive integer',
        status: 400,
      });
    }
    const users = await userService.searchUsers(
      String(query).trim() as string,
      Number(limit) as number,
    );
    res.json({ data: users });
  } catch (error) {
    next(error);
  }
};

export const getUserSessions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const { query, limit = 10 } = req.query;

    if (typeof query !== 'string' || query.trim() === '') {
      throw new AppError({
        message: 'Query parameter "query" must be a non-empty string',
        status: 400,
      });
    }
    if (isNaN(Number(limit)) || Number(limit) <= 0) {
      throw new AppError({
        message: 'Query parameter "limit" must be a positive integer',
        status: 400,
      });
    }

    const sessions = await userService.searchUserSessions(userId, String(query).trim(), Number(limit) as number);

    res.json({ data: sessions });
  } catch (error) {
    next(error);
  }
};
