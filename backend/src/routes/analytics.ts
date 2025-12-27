import { Router } from 'express';
import { getProductAndCartKPI, getSearchKPI, getTraffic } from '../controllers/analyticsController';

const router = Router();

router.get('/traffic', getTraffic);
router.get('/search', getSearchKPI);
router.get('/product-and-cart', getProductAndCartKPI);

export default router;