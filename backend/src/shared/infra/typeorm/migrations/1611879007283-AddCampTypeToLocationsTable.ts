import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddCampTypeToLocationsTable1611879007283
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
