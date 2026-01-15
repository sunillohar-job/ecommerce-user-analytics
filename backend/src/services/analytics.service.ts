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
        /* 1 Filter by time range */
        {
          $match: {
            startedAt: {
              $gte: start,
              $lte: end,
            },
          },
        },

        /* 2 Lookup for events */
        {
          $lookup: {
            from: 'events',
            localField: 'sessionId',
            foreignField: 'sessionId',
            as: 'events',
          },
        },

        /* 3 Faceted(runs multiple sub-pipelines on the same input documents in a single operation) KPIs */
        {
          $facet: {
            /*3.1 TOTAL SESSIONS */
            totalSessions: [{ $count: 'count' }],

            /*3.2 ACTIVE USERS */
            activeUsers: [{ $group: { _id: '$userId' } }, { $count: 'count' }],

            /*3.3 PAGE VIEWS BY PAGE */
            pageViewsByPage: [
              /* deconstructs an array */
              { $unwind: '$events' },

              /* match event types in 'PAGE_VIEW', 'SEARCH', 'ORDER_PLACED'  */
              {
                $match: {
                  'events.eventType': {
                    $in: ['PAGE_VIEW', 'SEARCH', 'ORDER_PLACED'],
                  },
                },
              },

              /* count by unique page  */
              {
                $group: {
                  _id: '$events.page',
                  views: { $sum: 1 },
                },
              },

              /* sort by views desc  */
              { $sort: { views: -1 } },

              /* project page and views  */
              {
                $project: {
                  _id: 0,
                  page: '$_id',
                  views: 1,
                },
              },
            ],

            /*3.4 SESSIONS OVER TIME */
            sessionsOverTime: [
              /* Group by session per day */
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
              /* sort startedAt asc */
              { $sort: { _id: 1 } },
              /* project date and session */
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
        /* 1 Filter search events by time */
        {
          $match: {
            timestamp: {
              $gte: start,
              $lte: end,
            },
            eventType: 'SEARCH',
          },
        },

        /* 2 Faceted Search KPIs */
        {
          $facet: {
            /*2.1 TOTAL SEARCHES */
            totalSearches: [{ $count: 'count' }],

            /*2.2 TOP QUERIES */
            topQueries: [
              /* group by query and count */
              {
                $group: {
                  _id: '$metadata.query',
                  searches: { $sum: 1 },
                },
              },
              /* sort by searches desc */
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

            /*2.3 ZERO RESULT QUERIES */
            zeroResultQueries: [
              /* match event with 0 resultCount in metadata */
              { $match: { 'metadata.resultCount': 0 } },
              /* group by similar query and count */
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
        /* 1 Filter 'ADD_TO_CART', 'REMOVE_FROM_CART', 'ORDER_PLACED' events by given time range */
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

        /* 2 Faceted product and cart KPIs */
        {
          $facet: {
            /*2.1 cart actions */
            cartActions: [
              /* get count grp by eventType('ADD_TO_CART', 'REMOVE_FROM_CART', 'ORDER_PLACED') */
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
            /*2.2 top products */
            topProducts: [
              /* filter 'ADD_TO_CART' eventType  */
              { $match: { eventType: 'ADD_TO_CART' } },
              /* group by productId  */
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
        /* 1 Filter 'ORDER_PLACED' events by given time range */
        {
          $match: {
            timestamp: {
              $gte: start,
              $lte: end,
            },
            eventType: 'ORDER_PLACED',
          },
        },
        /* 2 Faceted revenue KPIs */
        {
          $facet: {
            /* 2.1 revenue stats */
            revenueStats: [
              /*grp everything together(amount, orders and avg of amount)   */
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
            /* 2.2 order over time */
            ordersOverTime: [
              /*grp by per day timestamp  and count orders by per day   */
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
        /* 1 Filter events by given time range */
        {
          $match: {
            timestamp: {
              $gte: start,
              $lte: end,
            },
          },
        },
        /* 2 Faceted user behaviors KPIs */
        {
          $facet: {
            /* 2.1 User journey */
            funnel: [
              /* grp by eventType, add set of users with array of userId */
              {
                $group: {
                  _id: '$eventType',
                  users: { $addToSet: '$userId' },
                },
              },
              /* project eventType, uniqueUsersCount  */
              {
                $project: {
                  _id: 0,
                  eventType: '$_id',
                  uniqueUsersCount: { $size: '$users' },
                },
              },
              {
                $sort: { uniqueUsersCount: -1 },
              },
            ],
            /* 2.2 User Device Distribution */
            devices: [
              /* grp by devices, add set of users with array of userId */
              {
                $group: {
                  _id: '$metadata.device',
                  users: { $addToSet: '$userId' },
                },
              },
              /* project device, uniqueUsersCount  */
              {
                $project: {
                  _id: 0,
                  device: '$_id',
                  uniqueUsersCount: { $size: '$users' },
                },
              },
              {
                $sort: { uniqueUsersCount: -1 },
              },
            ],
          },
        },
      ])
      .next();
  }
}
