import MongoDBClient from "../db/mongoClient";
import { UserEvent } from "../models/user-event.interface";

export default class EventService {
  private events: UserEvent[] = [];
  private collection: string = 'events';

  async queryEvents(userId: string): Promise<UserEvent[]> {
    const db = MongoDBClient.getDb();
    const collection = db.collection<UserEvent>(this.collection);
    const docs = await collection.find({ userId }).toArray();
    return docs;
  }

  async insertEvent(payload: UserEvent): Promise<UserEvent> {
    const e: UserEvent = {
      id: String(this.events.length + 1),
      userId: payload.userId,
      sessionId: payload.sessionId,
      eventType: payload.eventType,
      page: payload.page,
      timestamp: new Date().toISOString(),
      ...(payload.metadata && { metadata: payload.metadata }),
    };
    this.events.push(e);
    return e;
  }
}
