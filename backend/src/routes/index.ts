import { Router } from 'express';
import healthRouter from './health';
import usersRouter from './users';
import analyticsRouter from './analytics'
import { periodHandler } from '../middlewares/periodValidator';

const router = Router();

router.use('/health', healthRouter);
router.use('/users', usersRouter);
router.use('/analytics', periodHandler ,analyticsRouter);

export default router;
