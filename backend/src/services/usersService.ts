import { config } from '../config';
import MongoDBClient from '../db/mongoClient';
import { UserJourneyResponse } from '../models/user-journey.interface';
import { User } from '../models/user.interface';

export class UsersService {
  async getJourneys(
    userId: string,
    from: string,
    to: string,
    limit: number,
  ): Promise<UserJourneyResponse | null> {
    const startDate = new Date(from);
    const endDate = new Date(to);

    const pipeline = [
      /* 1️⃣ Filter sessions early */
      {
        $match: {
          userId,
          startedAt: { $gte: startDate, $lte: endDate },
        },
      },

      /* 2️⃣ Lookup events */
      {
        $lookup: {
          from: 'events',
          let: {
            sessionId: '$sessionId',
            userId: '$userId',
            lastActivityAt: '$lastActivityAt',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$sessionId', '$$sessionId'] }, { $eq: ['$userId', '$$userId'] }],
                },
              },
            },

            { $sort: { timestamp: 1 } },

            /* 3️⃣ Window fields for next event */
            {
              $setWindowFields: {
                sortBy: { timestamp: 1 },
                output: {
                  nextTimestamp: { $shift: { output: '$timestamp', by: 1 } },
                  nextPage: { $shift: { output: '$page', by: 1 } },
                },
              },
            },

            /* 4️⃣ Compute per-event metrics */
            {
              $addFields: {
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

                purchaseAmount: {
                  $cond: [
                    { $eq: ['$eventType', 'ORDER_PLACED'] },
                    {
                      $round: [{ $ifNull: ['$metadata.amount', 0] }, 2],
                    },
                    0,
                  ],
                },

                purchaseQuantity: {
                  $cond: [
                    { $eq: ['$eventType', 'ORDER_PLACED'] },
                    { $ifNull: ['$metadata.quantity', 1] },
                    0,
                  ],
                },
              },
            },

            /* 5️⃣ Clean temp fields */
            {
              $project: {
                nextTimestamp: 0,
                nextPage: 0,
              },
            },
          ],
          as: 'events',
        },
      },

      /* 6️⃣ Aggregate session metrics ONCE */
      {
        $addFields: {
          totalEvents: { $size: '$events' },

          totalTimeSpent: {
            $sum: '$events.timeSpentOnPage',
          },

          totalPurchaseAmount: {
            $sum: '$events.purchaseAmount',
          },

          totalPurchaseQuantity: {
            $sum: '$events.purchaseQuantity',
          },

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

      {
        $addFields: {
          totalDistinctPages: { $size: '$distinctPages' },
        },
      },

      /* 7️⃣ Session projection */
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

      /* 8️⃣ Global totals */
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

      {
        $project: {
          _id: 0,
          totalEvents: 1,
          totalPurchaseAmount: 1,
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
}
