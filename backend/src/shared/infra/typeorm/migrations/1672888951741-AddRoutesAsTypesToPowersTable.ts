import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddRoutesAsTypesToPowersTable1672888951741
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'powers',
      'type',
      new TableColumn({
        name: 'type',
        type: 'enum',
        enum: [
          'discipline',
          'combination',
          'ritual',
          'gift',
          'arcanoi',
          'spheres',
          'routes',
          'other',
        ],
        default: "'other'",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'powers',
      'type',
      new TableColumn({
        name: 'type',
        type: 'enum',
        enum: [
          'discipline',
          'combination',
          'ritual',
          'gift',
          'arcanoi',
          'spheres',
          'other',
        ],
        default: "'other'",
      }),
    );
  }
}
