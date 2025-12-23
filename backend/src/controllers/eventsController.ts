import { Request, Response, NextFunction } from 'express';
import EventService  from '../services/eventService';
import { UserEvent } from '../models/user-event.interface';

const eventService = new EventService();

export async function QueryEvents(req: Request, res: Response, next: NextFunction) {
  try {
    const  { userId, from, to, limit = 100 } = req.query;
    const events = await eventService.queryEvents();
    res.json({ data: events });
  } catch (err) {
    next(err);
  }
}

export async function createEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const payload: UserEvent = req.body;
    await eventService.insertEvent(payload);
    res.status(201).json({ message: 'Event created successfully'});
  } catch (err) {
    next(err);
  }
}
