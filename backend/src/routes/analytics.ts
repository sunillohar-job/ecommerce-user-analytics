import { Router } from 'express';
import { getProductAndCartKPI, getSearchKPI, getTraffic, getRevenueAndConversionKPI, getUserBehaviorAndFunnelKPI } from '../controllers/analyticsController';

const router = Router();

router.get('/traffic', getTraffic);
router.get('/search', getSearchKPI);
router.get('/product-and-cart', getProductAndCartKPI);
router.get('/revenue-and-conversion', getRevenueAndConversionKPI);
router.get('/user-behavior-and-funnel', getUserBehaviorAndFunnelKPI);

export default router;