import { Router } from 'express';
import healthRouter from './health';
import usersRouter from './users';
import analyticsRouter from './analytics';
import { periodQueryValidator } from '../middlewares/periodQueryValidator';
import { xRequestIdValidator } from '../middlewares/xRequestIdValidator';

const router = Router();

router.use('/health', healthRouter);
router.use('/users', xRequestIdValidator, usersRouter);
router.use('/analytics', xRequestIdValidator, periodQueryValidator, analyticsRouter);

export default router;
