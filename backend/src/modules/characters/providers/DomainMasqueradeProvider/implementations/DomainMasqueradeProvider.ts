import IDomainMasqueradeProvider from '@modules/characters/providers/DomainMasqueradeProvider/models/IDomainMasqueradeProvider';
import redis from 'redis';

class DomainMasqueradeProvider implements IDomainMasqueradeProvider {
  private redisClient: redis.RedisClient;

  private domainMasquerade: number;

  constructor() {
    this.redisClient = redis.createClient({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASS || undefined,
    });

    this.domainMasquerade = 0;
  }

  public get(): number {
    let currentMasquerade: string | null;

    this.redisClient.get('Masquerade', (_, value) => {
      currentMasquerade = value;

      if (currentMasquerade === null) {
        this.domainMasquerade = 0;
      } else {
        this.domainMasquerade = parseInt(currentMasquerade, 10);
      }

      return true;
    });

    return this.domainMasquerade;
  }

  public set(masquerade: number): boolean {
    if (masquerade < 0 || masquerade > 10) return false;

    this.domainMasquerade = masquerade;
    return this.redisClient.set('Masquerade', `${masquerade}`);
  }
}

export default DomainMasqueradeProvider;
