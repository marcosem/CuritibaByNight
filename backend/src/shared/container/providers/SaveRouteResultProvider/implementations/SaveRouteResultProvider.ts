import ISaveRouteResultProvider from '@shared/container/providers/SaveRouteResultProvider/models/ISaveRouteResultProvider';
import redis from 'redis';
import redisConnection from '@config/redisConnection';
import util from 'util';

class FakeSaveRouteResultProvider implements ISaveRouteResultProvider {
  private redisClient: redis.RedisClient;

  constructor() {
    this.redisClient = redisConnection;
  }

  public async get(route: string): Promise<string> {
    const getRouteResult = util
      .promisify(this.redisClient.get)
      .bind(this.redisClient);

    const routeResult: string | null = await getRouteResult(route);

    let result: string;
    if (routeResult === null) {
      result = '';
    } else {
      result = routeResult;
    }

    return result;
  }

  public set(route: string, result: string): boolean {
    return this.redisClient.set(route, result);
  }

  public remove(route: string): boolean {
    return this.redisClient.del(route);
  }
}

export default FakeSaveRouteResultProvider;
