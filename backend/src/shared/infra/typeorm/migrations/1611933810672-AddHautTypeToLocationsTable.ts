import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddHautTypeToLocationsTable1611933810672
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'locations',
      'type',
      new TableColumn({
        name: 'type',
        type: 'enum',
        enum: [
          'haven',
          'airport',
          'camp',
          'castle',
          'haunt',
          'holding',
          'mansion',
          'nightclub',
          'university',
          'other',
        ],
        default: "'other'",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'locations',
      'type',
      new TableColumn({
        name: 'type',
        type: 'enum',
        enum: [
          'haven',
          'airport',
          'camp',
          'castle',
          'holding',
          'mansion',
          'nightclub',
          'university',
          'other',
        ],
        default: "'other'",
      }),
    );
  }
}
