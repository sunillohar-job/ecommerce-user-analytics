import { EventType } from './event-type.constant';

export interface UserEvent {
  id?: string;
  userId: string;
  sessionId: string;
  eventType: EventType;
  page: string;
  timestamp: string; // ISO 8601 date format
  metadata?: Record<string, unknown>;
}
