import redis from 'redis';

const redisConnection: redis.RedisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS || undefined,
});

export default redisConnection;
