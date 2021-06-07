import { Request, Response, NextFunction } from 'express';
import redisConnection from '@config/redisConnection';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import AppError from '@shared/errors/AppError';

const redisClient = redisConnection;

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'ratelimit',
  points: 20,
  duration: 1,
});

export default async function rateLimiter(
  req: Request,
  _: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await limiter.consume(req.ip);

    return next();
  } catch (err) {
    throw new AppError('Too many requests', 429);
  }
}
