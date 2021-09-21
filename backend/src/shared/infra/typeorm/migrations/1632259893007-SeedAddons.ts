import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';
import addonsSeed from '@shared/infra/typeorm/seeds/addonsSeed';
import Addon from '@modules/locations/infra/typeorm/entities/Addon';

export default class SeedAddons1632259893007 implements MigrationInterface {
  public async up(_: QueryRunner): Promise<void> {
    await getRepository(Addon).save(addonsSeed);
  }

  public async down(_: QueryRunner): Promise<void> {
    // do nothing
  }
}
