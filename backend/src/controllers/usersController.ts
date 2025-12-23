import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../services/usersService';
import { AppError } from '../middlewares/errorHandler';

const userService = new UsersService();

export const getUserJourneys = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const {from, to, limit = 100 } = req.query;
    const journeys = await userService.getJourneys(userId);
    res.json(journeys);
  } catch (error) {
    next(error);
  }
};

export const getUserSessions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const  {from, to, limit = 100 } = req.query;
    const sessions = await userService.getSessions(userId);
    res.json(sessions);
  } catch (error) {
    next(error);
  }
};

export const searchUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const  { query = '', limit = 10 } = req.query;
    if(typeof query !== 'string' || query.trim() === '') {
      throw new AppError({
        message: 'Query parameter "query" must be a non-empty string',
        status: 400
      })
    }
    const users = await userService.searchUsers(String(query).trim() as string, Number(limit) as number);
    res.json({data: users});
  } catch (error) {
    next(error);
  }
};