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

  public async remove(route: string): Promise<boolean> {
    let removeResult: boolean;

    if (route.indexOf('*') >= 0) {
      const getRouteKeys = util
        .promisify(this.redisClient.keys)
        .bind(this.redisClient);

      const redisKeys: string[] | undefined = await getRouteKeys(route);

      removeResult = true;
      if (redisKeys) {
        redisKeys.forEach(key => {
          removeResult = removeResult && this.redisClient.del(key);
        });
      }
    } else {
      removeResult = this.redisClient.del(route);
    }

    return removeResult;
  }
}

export default FakeSaveRouteResultProvider;
