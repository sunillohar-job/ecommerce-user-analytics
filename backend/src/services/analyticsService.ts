import { config } from '../config';
import MongoDBClient from '../db/mongoClient';
import { TrafficAnalyticsData } from '../models/analytics.interface';

export class AnalyticsService {
  async getTraffic(start: Date, end: Date): Promise<TrafficAnalyticsData | null> {
    const db = MongoDBClient.getDb();
    const sessionsCollection = db.collection(config.collections.SESSIONS);
    return sessionsCollection
      .aggregate<TrafficAnalyticsData>([
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
            activeUsers: [{ $group: { _id: '$userId' } }, { $count: 'count' }],

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
              {
                $project: {
                  _id: 0,
                  page: '$_id',
                  views: 1,
                },
              },
            ],

            /* SESSIONS OVER TIME */
            sessionsOverTime: [
              {
                $group: {
                  _id: {
                    $dateTrunc: {
                      date: '$startedAt',
                      unit: 'hour',
                    },
                  },
                  sessions: { $sum: 1 },
                },
              },
              { $sort: { _id: 1 } },
              {
                $project: {
                  _id: 0,
                  date: '$_id',
                  // minute: '$_id',
                  sessions: 1,
                },
              },
            ],
          },
        },
      ])
      .next();
  }

  async getSearchKPI(start: Date, end: Date): Promise<any> {
    const db = MongoDBClient.getDb();
    const eventsCollection = db.collection(config.collections.EVENTS);
    return eventsCollection
      .aggregate([
        /* 1️⃣ Filter search events by time */
        {
          $match: {
            timestamp: {
              $gte: start,
              $lte: end,
            },
            eventType: 'SEARCH',
          },
        },

        /* 2️⃣ Faceted Search KPIs */
        {
          $facet: {
            /* TOTAL SEARCHES */
            totalSearches: [{ $count: 'count' }],

            /* TOP QUERIES */
            topQueries: [
              {
                $group: {
                  _id: '$metadata.query',
                  searches: { $sum: 1 },
                },
              },
              { $sort: { searches: -1 } },
              { $limit: 10 },
              {
                $project: {
                  _id: 0,
                  query: '$_id',
                  searches: 1,
                },
              },
            ],

            /* ZERO RESULT QUERIES */
            zeroResultQueries: [
              { $match: { 'metadata.resultCount': 0 } },
              {
                $group: {
                  _id: '$metadata.query',
                  searches: { $sum: 1 },
                },
              },
              {
                $project: {
                  _id: 0,
                  query: '$_id',
                  searches: 1,
                },
              },
            ],
          },
        },
      ])
      .next();
  }
}
