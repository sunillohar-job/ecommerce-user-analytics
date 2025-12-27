import { Router } from 'express';
import { getProductAndCartKPI, getSearchKPI, getTraffic, getRevenueAndConversion } from '../controllers/analyticsController';

const router = Router();

router.get('/traffic', getTraffic);
router.get('/search', getSearchKPI);
router.get('/product-and-cart', getProductAndCartKPI);
router.get('/revenue-and-conversion', getRevenueAndConversion);

export default router;