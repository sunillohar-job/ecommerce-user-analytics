import { Router } from 'express';
import healthRouter from './health';
import usersRouter from './users';
import analyticsRouter from './analytics'

const router = Router();

router.use('/health', healthRouter);
router.use('/users', usersRouter);
router.use('/analytics', analyticsRouter);

export default router;
