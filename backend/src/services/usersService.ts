import { config } from '../config';
import MongoDBClient from '../db/mongoClient';
import { User } from '../models/user.interface';

export class UsersService {
  // Sorted by timestamp (desc)
  async getSessions(userId: string) {
    return {
      userId: 'u123',
      sessions: [
        {
          sessionId: 's1',
          startTime: '2025-01-10T10:00:00Z',
          endTime: '2025-01-10T10:15:00Z',
          pageViews: 8,
          purchaseCount: 1,
          totalTimeSpent: 900,
        },
      ],
    };
  }

  async getJourneys(userId: string, from: string, to: string, limit: number) {
    const startDate = new Date(from);
    const endDate = new Date(to);

    const pipeline = [
      /* 1️⃣ Filter sessions */
      {
        $match: {
          userId,
          startedAt: { $gte: startDate, $lte: endDate },
        },
      },

      /* 2️⃣ Fetch events per session */
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

            /* 3️⃣ Get next event */
            {
              $setWindowFields: {
                sortBy: { timestamp: 1 },
                output: {
                  nextTimestamp: {
                    $shift: { output: '$timestamp', by: 1 },
                  },
                  nextPage: {
                    $shift: { output: '$page', by: 1 },
                  },
                },
              },
            },

            /* 4️⃣ Calculate time spent */
            {
              $addFields: {
                rawTimeSpentMs: {
                  $cond: [
                    {
                      $and: [{ $ne: ['$nextTimestamp', null] }, { $ne: ['$page', '$nextPage'] }],
                    },
                    { $subtract: ['$nextTimestamp', '$timestamp'] },
                    {
                      $subtract: ['$$lastActivityAt', '$timestamp'],
                    },
                  ],
                },
              },
            },

            /* 5️⃣ Convert to seconds & avoid negatives */
            {
              $addFields: {
                timeSpentOnPage: {
                  $max: [{ $divide: ['$rawTimeSpentMs', 1000] }, 0],
                },
              },
            },

            {
              $project: {
                rawTimeSpentMs: 0,
                nextTimestamp: 0,
                nextPage: 0,
              },
            },
          ],
          as: 'events',
        },
      },

      /* 6️⃣ Purchase aggregation */
      {
        $addFields: {
          purchaseEvents: {
            $filter: {
              input: '$events',
              as: 'e',
              cond: { $eq: ['$$e.eventType', 'ORDER_PLACED'] },
            },
          },
        },
      },

      {
        $addFields: {
          totalPurchaseAmount: {
            $sum: {
              $map: {
                input: '$purchaseEvents',
                as: 'p',
                in: {
                  $multiply: ['$$p.metadata.price', { $ifNull: ['$$p.metadata.quantity', 1] }],
                },
              },
            },
          },
          totalPurchaseItems: {
            $sum: {
              $map: {
                input: '$purchaseEvents',
                as: 'p',
                in: { $ifNull: ['$$p.metadata.quantity', 1] },
              },
            },
          },
        },
      },

      /* 7️⃣ Session total time */
      {
        $addFields: {
          totalTimeSpent: {
            $sum: '$events.timeSpentOnPage',
          },
        },
      },

      /* 8️⃣ Final response */
      {
        $project: {
          _id: 0,
          sessionId: 1,
          startedAt: 1,
          lastActivityAt: 1,
          endedAt: 1,
          totalPurchaseAmount: 1,
          totalPurchaseItems: 1,
          totalTimeSpent: 1,
          events: {
            eventType: 1,
            page: 1,
            timestamp: 1,
            metadata: 1,
            timeSpentOnPage: 1,
          },
        },
      },
    ];

    const db = MongoDBClient.getDb();
    const collection = db.collection(config.collections.SESSIONS);
    const result = await collection.aggregate(pipeline).toArray();
    return result;
  }

  async searchUsers(query: string, limit: number) {
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
