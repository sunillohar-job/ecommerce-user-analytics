import MongoDBClient from '../db/mongoClient';
import { User } from '../models/user.interface';

export class UsersService {
  private collection: string = 'users';
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

  async getJourneys(userId: string) {
    const startDate = new Date('2025-11-01T00:00:00Z');
    const endDate = new Date('2025-12-31T23:59:59Z');

    const pipeline = [
      /* 1️⃣ Filter by user only (date filter later) */
      {
        $match: { userId },
      },

      /* 2️⃣ Convert timestamp string → Date */
      {
        $addFields: {
          ts: { $toDate: '$timestamp' },
        },
      },

      /* 3️⃣ Date range filter */
      {
        $match: {
          ts: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },

      /* 4️⃣ Sort chronologically */
      {
        $sort: { sessionId: 1, ts: 1 },
      },

      /* 5️⃣ Window function to get next event */
      {
        $setWindowFields: {
          partitionBy: '$sessionId',
          sortBy: { ts: 1 },
          output: {
            nextTs: {
              $shift: { output: '$ts', by: -1 },
            },
          },
        },
      },

      /* 6️⃣ Compute time spent */
      {
        $addFields: {
          timeSpent: {
            $cond: [
              {
                $and: [{ $eq: ['$eventType', 'PAGE_VIEW'] }, { $ne: ['$nextTs', null] }],
              },
              {
                $dateDiff: {
                  startDate: '$ts',
                  endDate: '$nextTs',
                  unit: 'second',
                },
              },
              null,
            ],
          },
        },
      },

      /* 7️⃣ Group per session */
      {
        $group: {
          _id: '$sessionId',
          sessionStart: { $first: '$ts' },

          events: {
            $push: {
              type: '$eventType',
              page: '$page',
              timeSpent: '$timeSpent',
              amount: '$metadata.amount',
            },
          },

          pages: {
            $sum: { $cond: [{ $eq: ['$eventType', 'PAGE_VIEW'] }, 1, 0] },
          },

          purchases: {
            $sum: { $cond: [{ $eq: ['$eventType', 'PURCHASE'] }, 1, 0] },
          },

          sessionTime: {
            $sum: {
              $cond: [{ $eq: ['$eventType', 'PAGE_VIEW'] }, '$timeSpent', 0],
            },
          },
        },
      },

      /* 8️⃣ Aggregate user-level totals */
      {
        $group: {
          _id: null,

          sessions: {
            $push: {
              sessionId: '$_id',
              sessionStart: '$sessionStart',
              pages: '$pages',
              purchases: '$purchases',
              sessionTime: '$sessionTime',
              events: '$events',
            },
          },

          sessionsCount: { $sum: 1 },
          totalPages: { $sum: '$pages' },
          totalPurchases: { $sum: '$purchases' },
          totalTimeSeconds: { $sum: '$sessionTime' },
        },
      },

      /* 9️⃣ Final response */
      {
        $project: {
          _id: 0,
          userId,
          sessionsCount: 1,
          totalPages: 1,
          totalPurchases: 1,
          totalTimeSeconds: 1,
          sessions: 1,
        },
      },
    ];

    const db = MongoDBClient.getDb();
    const collection = db.collection('events');
    const result = await collection.aggregate(pipeline).toArray();
    return result;
  }

  async searchUsers(query: string, limit: number) {
    const db = MongoDBClient.getDb();
    const collection = db.collection<User>(this.collection);
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
