import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { config } from './config';
import packageJson from '../package.json';

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: packageJson.name,
      version: "1.0.0",
      description: "API documentation",
    },
    servers: [
      {
        url: `http://localhost:${config.port}/api`,
        description: "Local server",
      },
    ],
  },
  apis: ["./src/routes/*.js","./src/routes/*.ts"], // 👈 where swagger comments live
};

const openapiSpecification = swaggerJSDoc(options);

const app = express();

app.use(helmet() as any);
app.use(cors());
app.use(express.json());

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.use('/api', routes);

app.use(errorHandler);

export default app;
