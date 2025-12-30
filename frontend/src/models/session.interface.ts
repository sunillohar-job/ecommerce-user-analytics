
  export interface Session {
    sessionId: string;
    userId: string;
    startedAt: string;
    lastActivityAt: string;
    endedAt: string;
    metadata: Record<string, unknown>;
  }