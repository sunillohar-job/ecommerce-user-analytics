import { Router } from 'express';
import {
  getProductAndCartKPI,
  getSearchKPI,
  getTraffic,
  getRevenueAndConversionKPI,
  getUserBehaviorAndFunnelKPI,
} from '../controllers/analyticsController';

const router = Router();

/**
 * @swagger
 * /analytics/traffic:
 *   get:
 *     summary: Get Traffic & Engagement KPI
 *     tags:
 *       - Analytics
 *     parameters:
 *       - $ref: '#/components/parameters/PeriodQueryParam'
 *       - $ref: '#/components/parameters/XRequestIdHeader'
 *     responses:
 *       200:
 *         description: Traffic analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TrafficAnalyticsDataResponse'
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *
 */
router.get('/traffic', getTraffic);

/**
 * @swagger
 * /analytics/search:
 *   get:
 *     summary: Get Product Search KPI
 *     tags:
 *       - Analytics
 *     parameters:
 *       - $ref: '#/components/parameters/PeriodQueryParam'
 *       - $ref: '#/components/parameters/XRequestIdHeader'
 *     responses:
 *       200:
 *         description: Search analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchAnalyticsDataResponse'
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.get('/search', getSearchKPI);

/**
 * @swagger
 * /analytics/product-and-cart:
 *   get:
 *     summary: Get Product & Cart KPI
 *     tags:
 *       - Analytics
 *     parameters:
 *       - $ref: '#/components/parameters/PeriodQueryParam'
 *       - $ref: '#/components/parameters/XRequestIdHeader'
 *     responses:
 *       200:
 *         description: Product & Cart analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductAndCartAnalyticsDataResponse'
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.get('/product-and-cart', getProductAndCartKPI);

/**
 * @swagger
 * /analytics/revenue-and-conversion:
 *   get:
 *     summary: Get Revenue & conversion KPI
 *     tags:
 *       - Analytics
 *     parameters:
 *       - $ref: '#/components/parameters/PeriodQueryParam'
 *       - $ref: '#/components/parameters/XRequestIdHeader'
 *     responses:
 *       200:
 *         description: Revenue & conversion analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RevenueAndConversionAnalyticsDataResponse'
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.get('/revenue-and-conversion', getRevenueAndConversionKPI);

/**
 * @swagger
 * /analytics/user-behavior-and-funnel:
 *   get:
 *     summary: Get User behavior and Funnel KPI
 *     tags:
 *       - Analytics
 *     parameters:
 *       - $ref: '#/components/parameters/PeriodQueryParam'
 *       - $ref: '#/components/parameters/XRequestIdHeader'
 *     responses:
 *       200:
 *         description: User behavior and Funnel analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserBehaviorAndFunnelAnalyticsDataResponse'
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.get('/user-behavior-and-funnel', getUserBehaviorAndFunnelKPI);

export default router;
