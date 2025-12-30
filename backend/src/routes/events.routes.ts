import { Router } from 'express';
import { postEvent } from '../controllers/events.controller';

const router = Router();

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a user event
 *     description: Capture user analytics events such as page views, clicks, and interactions
 *     tags:
 *       - Events
 *     parameters:
 *       - $ref: '#/components/parameters/XRequestIdHeader'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserEvent'
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.post('/', postEvent);

export default router;
