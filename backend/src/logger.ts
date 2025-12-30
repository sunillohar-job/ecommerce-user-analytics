import pino from 'pino';
import { config } from './config';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  base: {
    service: 'ecommerce-user-analytics-service',
    env: config?.env,
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});
