import { Router } from 'express';
import { QueryEvents, createEvent } from '../controllers/eventsController';

const router = Router();

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Query events
 *     tags:
 *       - Events
 *     responses:
 *       200:
 *         description: List of events retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/', QueryEvents);

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     tags:
 *       - Events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - sessionId
 *               - eventType
 *               - page
 *               - timestamp
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "user_123"
 *               sessionId:
 *                 type: string
 *                 example: "session_456"
 *               eventType:
 *                 type: string
 *                 example: "PAGE_VIEW"
 *               page:
 *                 type: string
 *                 example: "/product/iphone-15"
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-19T09:45:00Z"
 *               metadata:
 *                 type: object
 *                 properties:
 *                   device:
 *                     type: string
 *                     example: "mobile"
 *                   browser:
 *                     type: string
 *                     example: "chrome"
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Invalid request body
 */
router.post('/', createEvent);

export default router;
