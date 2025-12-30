import { logger } from './logger';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import { AppError, errorHandler } from './middlewares/error-handler.middleware';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import packageJson from '../package.json';
import { pinoHttp } from 'pino-http';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: packageJson.name,
      version: '1.0.0',
      description: 'API documentation',
    },
    servers: [
      {
        url: `/api`,
        description: 'Server',
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/routes/*.ts', 'src/swagger/*.ts', 'src/swagger/*.js'],
};

const openapiSpecification = swaggerJSDoc(options);

const app = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          method: req.method,
          url: req.url,
          requestId: req.headers['x-request-id'],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.use('/api', routes);

app.use((req, res, next) => {
  next(
    new AppError({
      message: `Endpoint not found: ${req.method} ${req.originalUrl}`,
      status: 404,
    }),
  );
});

app.use(errorHandler);

export default app;
