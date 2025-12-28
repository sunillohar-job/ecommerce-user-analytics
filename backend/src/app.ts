import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { config } from './config';
import packageJson from '../package.json';
import morgan from 'morgan';

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
        url: `${config.host}:${config.port}/api`,
        description: 'Server',
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/routes/*.ts', 'src/swagger/*.ts', 'src/swagger/*.js'],
};

const openapiSpecification = swaggerJSDoc(options);

const app = express();

app.use(helmet() as any);
app.use(cors());
app.use(express.json());

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.use(morgan(':method :url :status :req[x-request-id] - :response-time ms'));

app.use('/api', routes);

app.use(errorHandler);

export default app;
