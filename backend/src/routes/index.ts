import { Router } from 'express';
import healthRouter from './health';
import usersRouter from './users';
import analyticsRouter from './analytics'
import { periodQueryValidator } from '../middlewares/periodQueryValidator';

const router = Router();

router.use('/health', healthRouter);
router.use('/users', usersRouter);
router.use('/analytics', periodQueryValidator ,analyticsRouter);

export default router;
