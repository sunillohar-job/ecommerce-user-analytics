import { Request, Response, NextFunction } from 'express';
import { EventsService } from '../services/events.service';
import { AppError } from '../middlewares/error-handler.middleware';
import { UserEvent } from '../models/user-event.interface';
import { EVENT_TYPES } from '../models/event-type.constant';

const eventsService = new EventsService();

export const postEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, sessionId, eventType, page, metadata } = req.body as UserEvent;
    if (!userId || typeof userId !== 'string') {
      throw new AppError({
        message: 'userId must be a non-empty string',
        status: 400,
      });
    }

    if (!sessionId || typeof sessionId !== 'string') {
      throw new AppError({
        message: 'sessionId must be a non-empty string',
        status: 400,
      });
    }

    if (!eventType) {
      throw new AppError({
        message: 'evenType must be a non-empty string',
        status: 400,
      });
    }

    if (!page || typeof page !== 'string') {
      throw new AppError({
        message: 'page must be a non-empty string',
        status: 400,
      });
    }

    if (metadata !== undefined && typeof metadata !== 'object') {
      throw new AppError({
        message: 'metadata must be an object',
        status: 400,
      });
    }
    await eventsService.postEvent({ userId, sessionId, eventType, page, metadata });
    res.status(201).send();
  } catch (error) {
    next(error);
  }
};
