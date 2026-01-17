import { config } from '../config';
import MongoDBClient from '../db/mongoClient';
import { Session } from '../models/session.interface';
import { UserJourneyResponse } from '../models/user-journey.interface';
import { User } from '../models/user.interface';

export class UsersService {
  async getJourneys(userId: string, from: string, to: string): Promise<UserJourneyResponse | null> {
    const startDate = new Date(from);
    const endDate = new Date(to);

    const pipeline = [
      /* 1 Filter sessions early for specific user and time range */
      {
        $match: {
          userId,
          startedAt: { $gte: startDate, $lte: endDate },
        },
      },

      /* 2 Lookup events for each session*/
      {
        $lookup: {
          from: 'events',
          /* Variable passed from sessions -> events pipeline */
          let: {
            sessionId: '$sessionId',
            userId: '$userId',
            lastActivityAt: '$lastActivityAt',
          },
          pipeline: [
            /* 2.1 Match each event belong to this session matched by sessionId and userId */
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$sessionId', '$$sessionId'] }, { $eq: ['$userId', '$$userId'] }],
                },
              },
            },

            /* 2.2 sort by timestamp ascending order needed for next event calculation */
            { $sort: { timestamp: 1 } },

            /* 2.3 Add window fields.
                - nextTimestamp: timestamp of next event
                - nextPage: page of next event
            */
            {
              $setWindowFields: {
                sortBy: { timestamp: 1 },
                output: {
                  nextTimestamp: { $shift: { output: '$timestamp', by: 1 } },
                  nextPage: { $shift: { output: '$page', by: 1 } },
                },
              },
            },

            /* 2.4 Compute per-event metrics
              - time spent on page
              - purchase amount
              - purchase quantity
            */
            {
              $addFields: {
                /* Time spent on page (in seconds)
                 If next page exists and page changed:
                   nextTimestamp - current timestamp
                 Else:
                   lastActivityAt - current timestamp
                 Ensures non-negative values
                */
                timeSpentOnPage: {
                  $max: [
                    {
                      $divide: [
                        {
                          $cond: [
                            {
                              $and: [
                                { $ne: ['$nextTimestamp', null] },
                                { $ne: ['$page', '$nextPage'] },
                              ],
                            },
                            { $subtract: ['$nextTimestamp', '$timestamp'] },
                            { $subtract: ['$$lastActivityAt', '$timestamp'] },
                          ],
                        },
                        1000,
                      ],
                    },
                    0,
                  ],
                },

                /* Revenue from this event (only if order placed) */
                purchaseAmount: {
                  $cond: [
                    { $eq: ['$eventType', 'ORDER_PLACED'] },
                    {
                      $round: [{ $ifNull: ['$metadata.amount', 0] }, 2],
                    },
                    0,
                  ],
                },

                /* Quantity purchased in this event */
                purchaseQuantity: {
                  $cond: [
                    { $eq: ['$eventType', 'ORDER_PLACED'] },
                    { $ifNull: ['$metadata.quantity', 1] },
                    0,
                  ],
                },
              },
            },

            /* 2.5 Remove temporary helper fields */
            {
              $project: {
                nextTimestamp: 0,
                nextPage: 0,
              },
            },
          ],
          /* Final events array attached to each session */
          as: 'events',
        },
      },

      /* 3 Aggregate session metrics. Calculated once per session */
      {
        $addFields: {
          /* Total number of events in session */
          totalEvents: { $size: '$events' },

          /* Total time spent across all pages */
          totalTimeSpent: {
            $sum: '$events.timeSpentOnPage',
          },

          /* Total revenue generated in session */
          totalPurchaseAmount: {
            $sum: '$events.purchaseAmount',
          },

          /* Total quantity purchased in session */
          totalPurchaseQuantity: {
            $sum: '$events.purchaseQuantity',
          },

          /* Distinct pages visited in session */
          distinctPages: {
            $setUnion: [
              {
                $filter: {
                  input: '$events.page',
                  as: 'p',
                  cond: { $ne: ['$$p', null] },
                },
              },
              [],
            ],
          },
        },
      },

      /* 4 addFields hasOrderPlaced Check if session has at least one valid order is placed. needed for conversion calculation */
      {
        $addFields: {
          hasOrderPlaced: {
            $gt: [
              {
                $size: {
                  $filter: {
                    input: '$events',
                    as: 'e',
                    cond: {
                      $and: [
                        { $eq: ['$$e.eventType', 'ORDER_PLACED'] },
                        { $gt: [{ $ifNull: ['$$e.metadata.amount', 0] }, 0] },
                      ],
                    },
                  },
                },
              },
              0,
            ],
          },
        },
      },

      /* 5 addFields totalDistinctPages store size of distinctPages */
      {
        $addFields: {
          totalDistinctPages: { $size: '$distinctPages' },
        },
      },

      /* 6 Session level projection */
      {
        $project: {
          _id: 0,
          sessionId: 1,
          startedAt: 1,
          lastActivityAt: 1,
          endedAt: 1,

          totalEvents: 1,
          totalTimeSpent: 1,
          totalPurchaseAmount: 1,
          totalPurchaseQuantity: 1,
          totalDistinctPages: 1,
          hasOrderPlaced: 1,

          events: {
            eventType: 1,
            page: 1,
            timestamp: 1,
            metadata: 1,
            timeSpentOnPage: 1,
          },
        },
      },

      /* 7 AGGREGATION across all sessions */
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          orderPlacedSessions: {
            $sum: { $cond: ['$hasOrderPlaced', 1, 0] },
          },
          totalEvents: { $sum: '$totalEvents' },
          totalPurchaseAmount: { $sum: '$totalPurchaseAmount' },
          totalPurchaseQuantity: { $sum: '$totalPurchaseQuantity' },
          sessions: { $push: '$$ROOT' },
        },
      },

      /* 8 Final Projection + conversion rate */
      {
        $project: {
          _id: 0,
          totalEvents: 1,
          totalPurchaseAmount: { $round: ['$totalPurchaseAmount', 2] },
          totalPurchaseQuantity: 1,
          sessions: 1,
          totalSessions: 1,
          orderPlacedSessions: 1,
          conversionRate: {
            $cond: [
              { $eq: ['$totalSessions', 0] },
              0,
              {
                $round: [
                  {
                    $multiply: [{ $divide: ['$orderPlacedSessions', '$totalSessions'] }, 100],
                  },
                  2,
                ],
              },
            ],
          },
        },
      },
    ];

    const db = MongoDBClient.getDb();
    const collection = db.collection(config.collections.SESSIONS);
    const result = await collection.aggregate<UserJourneyResponse>(pipeline).next();
    return result;
  }

  async searchUsers(query: string, limit: number): Promise<User[]> {
    const db = MongoDBClient.getDb();
    const collection = db.collection<User>(config.collections.USERS);
    return await collection
      .find({
        $or: [
          { userId: { $regex: query, $options: 'i' } },
          { fname: { $regex: query, $options: 'i' } },
          { lname: { $regex: query, $options: 'i' } },
        ],
      })
      .limit(limit)
      .toArray();
  }

  async searchUserSessions(userId: string, query: string, limit = 10): Promise<Session[]> {
    const db = MongoDBClient.getDb();
    const collection = db.collection<Session>(config.collections.SESSIONS);

    return await collection
      .find({
        userId,
        sessionId: { $regex: query, $options: 'i' },
      })
      .sort({ sessionId: 1 })
      .limit(limit)
      .toArray();
  }
}
