import { config } from '../config';
import MongoDBClient from '../db/mongoClient';
import { UserEvent } from '../models/user-event.interface';

export class EventsService {
  async postEvent({ userId, sessionId, eventType, page, metadata }: Partial<UserEvent>) {
    const db = MongoDBClient.getDb();
    const collection = db.collection<UserEvent>(config.collections.EVENTS);

    const event: UserEvent = {
      userId: userId!,
      sessionId: sessionId!,
      eventType: eventType!,
      page: page!,
      timestamp: new Date(),
      metadata,
    };

    const result = await collection.insertOne(event);

    return {
      eventId: result.insertedId.toString(),
    };
  }
}
