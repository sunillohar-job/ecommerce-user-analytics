import request from 'supertest';
import express, { Express } from 'express';
import { xRequestIdValidator } from '../../middlewares/x-request-id-validator.middleware';
import { periodQueryValidator } from '../../middlewares/period-query-validator.middleware';

jest.mock('../../controllers/users.controller', () => ({
  getUserJourneys: jest.fn((req, res) => res.json({ data: { sessions: [] } })),
  searchUsers: jest.fn((req, res) => res.json({ data: [] })),
}));

jest.mock('../../controllers/analytics.controller', () => ({
  getTraffic: jest.fn((req, res) => res.json({ data: { totalSessions: [] } })),
  getSearchKPI: jest.fn((req, res) => res.json({ data: { totalSearches: [] } })),
  getProductAndCartKPI: jest.fn((req, res) => res.json({ data: { cartActions: [] } })),
  getRevenueAndConversionKPI: jest.fn((req, res) => res.json({ data: { revenueStats: [] } })),
  getUserBehaviorAndFunnelKPI: jest.fn((req, res) => res.json({ data: { funnel: [] } })),
}));

jest.mock('../../middlewares/x-request-id-validator.middleware', () => ({
  xRequestIdValidator: jest.fn(),
}));

jest.mock('../../middlewares/period-query-validator.middleware', () => ({
  periodQueryValidator: jest.fn(),
}));

import router from '../../routes/index';

const mockXRequestIdValidator = xRequestIdValidator as jest.MockedFunction<
  typeof xRequestIdValidator
>;
const mockPeriodQueryValidator = periodQueryValidator as jest.MockedFunction<
  typeof periodQueryValidator
>;

describe('Routes Index', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    mockXRequestIdValidator.mockImplementation((req, res, next) => next());
    mockPeriodQueryValidator.mockImplementation((req, res, next) => next());
    app.use(router);
    jest.clearAllMocks();
  });

  describe('Health Routes', () => {
    it('should register /health route', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
    });
  });

  describe('Users Routes', () => {
    it('should register /users/search route', async () => {
      const response = await request(app)
        .get('/users/search')
        .set('x-request-id', 'test-request-id')
        .query({ query: 'test' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });

    it('should register /users/:userId/journeys route', async () => {
      const response = await request(app)
        .get('/users/user123/journeys')
        .set('x-request-id', 'test-request-id')
        .query({ from: '2023-01-01', to: '2023-01-31' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });

    it('should apply x-request-id validator to /users routes', async () => {
      mockXRequestIdValidator.mockClear();
      mockXRequestIdValidator.mockImplementation((req, res, next) => next());

      await request(app)
        .get('/users/search')
        .set('x-request-id', 'test-request-id')
        .query({ query: 'test' });

      expect(mockXRequestIdValidator).toHaveBeenCalled();
    });
  });

  describe('Analytics Routes', () => {
    it('should register /analytics/traffic route', async () => {
      const response = await request(app)
        .get('/analytics/traffic')
        .set('x-request-id', 'test-request-id')
        .query({ period: 'today' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });

    it('should register /analytics/search route', async () => {
      const response = await request(app)
        .get('/analytics/search')
        .set('x-request-id', 'test-request-id')
        .query({ period: 'today' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });

    it('should register /analytics/product-and-cart route', async () => {
      const response = await request(app)
        .get('/analytics/product-and-cart')
        .set('x-request-id', 'test-request-id')
        .query({ period: 'today' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });

    it('should register /analytics/revenue-and-conversion route', async () => {
      const response = await request(app)
        .get('/analytics/revenue-and-conversion')
        .set('x-request-id', 'test-request-id')
        .query({ period: 'today' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });

    it('should register /analytics/user-behavior-and-funnel route', async () => {
      const response = await request(app)
        .get('/analytics/user-behavior-and-funnel')
        .set('x-request-id', 'test-request-id')
        .query({ period: 'today' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });

    it('should apply x-request-id validator to /analytics routes', async () => {
      mockXRequestIdValidator.mockClear();
      mockXRequestIdValidator.mockImplementation((req, res, next) => next());

      await request(app)
        .get('/analytics/traffic')
        .set('x-request-id', 'test-request-id')
        .query({ period: 'today' });

      expect(mockXRequestIdValidator).toHaveBeenCalled();
    });

    it('should apply period query validator to /analytics routes', async () => {
      mockPeriodQueryValidator.mockClear();
      mockPeriodQueryValidator.mockImplementation((req, res, next) => next());

      await request(app)
        .get('/analytics/traffic')
        .set('x-request-id', 'test-request-id')
        .query({ period: 'today' });

      expect(mockPeriodQueryValidator).toHaveBeenCalled();
    });
  });


  describe('404 Handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/non-existent-route');

      expect(response.status).toBe(404);
    });
  });
});

