import { Router } from 'express';
import { getUserJourneys, getUserSessions, searchUsers } from '../controllers/users.controller';

const router = Router();

/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Search users by userId, first name, or last name
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term to match userId, first name, or last name
 *         example: john
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Maximum number of users to return
 *       - $ref: '#/components/parameters/XRequestIdHeader'
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.get('/search', searchUsers);

/**
 * @swagger
 * /users/{userId}/journeys:
 *   get:
 *     summary: Get user journeys
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Journey start date
 *       - in: query
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Journey end date
 *       - $ref: '#/components/parameters/XRequestIdHeader'
 *
 *     responses:
 *       200:
 *         description: Journey retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserJourneyFinalResponse'
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.get('/:userId/journeys', getUserJourneys);

/**
 * @swagger
 * /users/{userId}/sessions:
 *   get:
 *     summary: Search user sessions by sessionId
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: "u1001"
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID search term (partial match, case-insensitive)
 *         example: "u1001_s1"
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Maximum number of users to return
 *       - $ref: '#/components/parameters/XRequestIdHeader'
 *     responses:
 *       200:
 *         description: Sessions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SessionResponse'
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.get('/:userId/sessions', getUserSessions);

export default router;
