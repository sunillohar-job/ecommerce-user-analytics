import { Router } from 'express';
import { getUserJourneys, getUserSessions, searchUsers } from '../controllers/usersController';

const router = Router();

/**
 * @openapi
 * /users/search:
 *   get:
 *     summary: Search users by userId, first name, or last name
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: query
 *         required: false
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
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Internal server error
 */
router.get('/search', searchUsers);

router.get('/:userId/journeys', getUserJourneys);

router.get('/:userId/sessions', getUserSessions);

export default router;
