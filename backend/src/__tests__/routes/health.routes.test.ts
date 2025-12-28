import request from 'supertest';
import express, { Express } from 'express';
import healthRouter from '../../routes/health.routes';

describe('Health Routes', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/health', healthRouter);
  });

  it('should return health status on GET /health', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
  });
});

