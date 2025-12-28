import { Router } from 'express';
import { getUserJourneys, searchUsers } from '../controllers/usersController';

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
 *     summary: get users journey
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Journey start date
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
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: Maximum number of sessions to be return
 *       - $ref: '#/components/parameters/XRequestIdHeader'
 *
 *     responses:
 *       200:
 *         description: Journey retrieved successfully
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/UserJourneyFinalResponse'
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.get('/:userId/journeys', getUserJourneys);

export default router;
