import { Router } from 'express';
import { getTraffic } from '../controllers/analyticsController';

const router = Router();

router.get('/traffic', getTraffic);

export default router;