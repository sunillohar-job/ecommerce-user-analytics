import { config } from '../config';
import MongoDBClient from '../db/mongoClient';

export class AnalyticsService {
  async getTraffic(start: Date, end: Date): Promise<any> {
    const db = MongoDBClient.getDb();
    const sessionsCollection = db.collection(config.collections.SESSIONS);
    const eventsCollection = db.collection(config.collections.EVENTS);
    return sessionsCollection
      .aggregate([
        /* 1️⃣ Filter by time range */
        {
          $match: {
            startedAt: {
              $gte: start,
              $lte: end,
            },
          },
        },

        /* 2️⃣ Join events */
        {
          $lookup: {
            from: 'events',
            localField: 'sessionId',
            foreignField: 'sessionId',
            as: 'events',
          },
        },

        /* 3️⃣ Faceted KPIs */
        {
          $facet: {
            /* TOTAL SESSIONS */
            totalSessions: [{ $count: 'count' }],

            /* ACTIVE USERS */
            activeUsers: [
              {
                $group: {
                  _id: '$userId',
                },
              },
              { $count: 'count' },
            ],

            /* PAGE VIEWS BY PAGE */
            pageViewsByPage: [
              { $unwind: '$events' },
              {
                $match: {
                  'events.eventType': {
                    $in: ['PAGE_VIEW', 'SEARCH', 'ORDER_PLACED'],
                  },
                },
              },
              {
                $group: {
                  _id: '$events.page',
                  views: { $sum: 1 },
                },
              },
              { $sort: { views: -1 } },
            ],

            /* SESSIONS OVER TIME */
            sessionsOverTime: [
              {
                $group: {
                  _id: {
                    $dateToString: {
                      date: '$startedAt',
                    },
                  },
                  sessions: { $sum: 1 },
                },
              },
              { $sort: { _id: 1 } },
            ],
          },
        },
      ])
      .next();
  }
}
