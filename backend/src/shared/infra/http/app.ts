import 'reflect-metadata';
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import 'express-async-errors';
import '@shared/infra/typeorm';
import '@shared/container';
import AppError from '@shared/errors/AppError';
import rateLimiter from '@shared/infra/http/middlewares/rateLimiter';
import webSocket from '@shared/infra/http/middlewares/webSocket';

// import expressWs from 'express-ws';
import routes from './routes';

const app = express();

// const ws = expressWs(app);

app.use(rateLimiter);
app.use(cors());
app.use(express.json());
app.use(routes);
app.use(webSocket);

app.use(errors());
app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // eslint-disable-next-line no-console
  console.error(err);

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

export default app;
