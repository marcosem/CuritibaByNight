import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';
import territoriesSeed from '@shared/infra/typeorm/seeds/territoriesSeed';
import Territory from '@modules/locations/infra/typeorm/entities/Territory';

export default class SeedTerritories1613343618068
  implements MigrationInterface {
  public async up(_: QueryRunner): Promise<void> {
    await getRepository(Territory).save(territoriesSeed);
  }

  public async down(_: QueryRunner): Promise<void> {
    // do nothing
  }
}
