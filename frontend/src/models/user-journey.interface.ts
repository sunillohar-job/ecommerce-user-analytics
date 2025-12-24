export interface UserJourneyResponse {
  totalPurchaseAmount: number;
  totalPurchaseItems: number;
  sessions: UserSessions[];
}
export interface UserSessions {
  sessionId: string;
  startedAt: string; // ISO date
  lastActivityAt: string; // ISO date
  endedAt: string; // ISO date
  events: SessionEvent[];
  totalPurchaseAmount: number;
  totalPurchaseItems: number;
  totalTimeSpent: number; // seconds
  totalDistinctPages: number;
}

export interface SessionEvent {
  eventType: string;
  page: string;
  timestamp: string; // ISO date
  metadata: EventMetadata;
  timeSpentOnPage: number; // seconds
}

export interface EventMetadata {
  [key: string]: unknown;
}
