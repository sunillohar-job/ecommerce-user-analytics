import { Router } from 'express';
import healthRouter from './health.routes';
import usersRouter from './users.routes';
import analyticsRouter from './analytics.routes';
import { periodQueryValidator } from '../middlewares/period-query-validator.middleware';
import { xRequestIdValidator } from '../middlewares/x-request-id-validator.middleware';

const router = Router();

router.use('/health', healthRouter);
router.use('/users', xRequestIdValidator, usersRouter);
router.use('/analytics', xRequestIdValidator, periodQueryValidator, analyticsRouter);

export default router;
