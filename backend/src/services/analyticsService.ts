import { config } from '../config';
import MongoDBClient from '../db/mongoClient';
import {
  ProductAndCartAnalyticsData,
  RevenueAndConversionAnalyticsData,
  SearchAnalyticsData,
  TrafficAnalyticsData,
  UserBehaviorAndFunnelAnalyticsData,
} from '../models/analytics.interface';

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
                      unit: 'day',
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
                  sessions: 1,
                },
              },
            ],
          },
        },
      ])
      .next();
  }

  async getSearchKPI(start: Date, end: Date): Promise<SearchAnalyticsData | null> {
    const db = MongoDBClient.getDb();
    const eventsCollection = db.collection(config.collections.EVENTS);
    return eventsCollection
      .aggregate<SearchAnalyticsData>([
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

  async getProductAndCartKPI(start: Date, end: Date): Promise<ProductAndCartAnalyticsData | null> {
    const db = MongoDBClient.getDb();
    const eventsCollection = db.collection(config.collections.EVENTS);
    return eventsCollection
      .aggregate<ProductAndCartAnalyticsData>([
        {
          $match: {
            timestamp: {
              $gte: start,
              $lte: end,
            },
            eventType: {
              $in: ['ADD_TO_CART', 'REMOVE_FROM_CART', 'ORDER_PLACED'],
            },
          },
        },
        {
          $facet: {
            cartActions: [
              {
                $group: {
                  _id: '$eventType',
                  count: { $sum: 1 },
                },
              },
              {
                $project: {
                  _id: 0,
                  eventType: '$_id',
                  count: 1,
                },
              },
            ],
            topProducts: [
              { $match: { eventType: 'ADD_TO_CART' } },
              {
                $group: {
                  _id: '$metadata.productId',
                  name: { $first: '$metadata.productName' },
                  quantity: { $sum: '$metadata.quantity' },
                },
              },
              {
                $project: {
                  _id: 0,
                  productId: '$_id',
                  name: 1,
                  quantity: 1,
                },
              },
              { $sort: { quantity: -1 } },
              { $limit: 10 },
            ],
          },
        },
      ])
      .next();
  }

  async getRevenueAndConversion(
    start: Date,
    end: Date,
  ): Promise<RevenueAndConversionAnalyticsData | null> {
    const db = MongoDBClient.getDb();
    const eventsCollection = db.collection(config.collections.EVENTS);
    return eventsCollection
      .aggregate<RevenueAndConversionAnalyticsData>([
        {
          $match: {
            timestamp: {
              $gte: start,
              $lte: end,
            },
            eventType: 'ORDER_PLACED',
          },
        },
        {
          $facet: {
            revenueStats: [
              {
                $group: {
                  _id: null,
                  revenue: { $sum: '$metadata.amount' },
                  orders: { $sum: 1 },
                  avgOrderValue: { $avg: '$metadata.amount' },
                },
              },
              {
                $project: {
                  _id: 0,
                  revenue: { $round: ['$revenue', 2] },
                  orders: 1,
                  avgOrderValue: { $round: ['$avgOrderValue', 2] },
                },
              },
            ],

            ordersOverTime: [
              {
                $group: {
                  _id: {
                    $dateTrunc: {
                      date: '$timestamp',
                      unit: 'day',
                    },
                  },
                  orders: { $sum: 1 },
                },
              },
              {
                $project: {
                  _id: 0,
                  date: '$_id',
                  orders: 1,
                },
              },
              { $sort: { date: 1 } },
            ],
          },
        },
      ])
      .next();
  }
  
  async getUserBehaviorAndFunnelKPI(
    start: Date,
    end: Date,
  ): Promise<UserBehaviorAndFunnelAnalyticsData | null> {
    const db = MongoDBClient.getDb();
    const eventsCollection = db.collection(config.collections.EVENTS);
    return eventsCollection
      .aggregate<UserBehaviorAndFunnelAnalyticsData>([
        {
          $match: {
            timestamp: {
              $gte: start,
              $lte: end,
            },
            eventType: {
              $in: ['PAGE_VIEW', 'SEARCH', 'ADD_TO_CART', 'ORDER_PLACED'],
            },
          },
        },
        {
          $addFields: {
            normalizedEventType: {
              $cond: [
                { $in: ['$eventType', ['PAGE_VIEW', 'SEARCH']] },
                'PAGE_VIEW_OR_SEARCH',
                '$eventType',
              ],
            },
          },
        },
        {
          $facet: {
            funnel: [
              {
                $group: {
                  _id: '$normalizedEventType',
                  users: { $addToSet: '$userId' },
                },
              },
              {
                $project: {
                  _id: 0,
                  eventType: '$_id',
                  uniqueUsersCount: { $size: '$users' },
                },
              },
            ],
            devices: [
              {
                $group: {
                  _id: '$metadata.device',
                  users: { $addToSet: '$userId' },
                },
              },
              {
                $project: {
                  _id: 0,
                  device: '$_id',
                  uniqueUsersCount: { $size: '$users' },
                },
              },
            ],
          },
        },
      ])
      .next();
  }
}
