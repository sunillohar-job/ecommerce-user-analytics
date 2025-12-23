import { Router } from 'express';
import healthRouter from './health';
import usersRouter from './users';
import eventsRouter from './events';

const router = Router();

router.use('/health', healthRouter);
router.use('/users', usersRouter);
router.use('/events', eventsRouter);

export default router;
