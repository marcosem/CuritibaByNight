// import IDomainMasqueradeProvider from '@modules/characters/providers/DomainMasqueradeProvider/models/IDomainMasqueradeProvider';
import ICurrentActionMonthProvider from '@modules/influences/providers/CurrentActionMonthProvider/models/ICurrentActionMonthProvider';
import redis from 'redis';
import redisConnection from '@config/redisConnection';
import util from 'util';

class CurrentActionMonthProvider implements ICurrentActionMonthProvider {
  private redisClient: redis.RedisClient;

  private actionMonth: string;

  constructor() {
    this.redisClient = redisConnection;
    this.actionMonth = '';
  }

  public async get(): Promise<string> {
    const getActionMonth = util
      .promisify(this.redisClient.get)
      .bind(this.redisClient);

    const actionMonth: string | null = await getActionMonth('ActionMonth');

    if (actionMonth === null) {
      this.actionMonth = '';
    } else {
      this.actionMonth = actionMonth;
    }

    return this.actionMonth;
  }

  public set(actionMonth: string): boolean {
    const dateFormatValidation = /(19|20)\d{2}-(0[1-9]|1[012])/;

    if (!dateFormatValidation.test(actionMonth)) return false;

    this.actionMonth = actionMonth;
    return this.redisClient.set('ActionMonth', actionMonth);
  }
}

export default CurrentActionMonthProvider;
