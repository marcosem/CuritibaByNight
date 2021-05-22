import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddRitualsAsTypeToCharactersTraitsTable1621650581415
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'characters_traits',
      'type',
      new TableColumn({
        name: 'type',
        type: 'enum',
        enum: [
          'creature',
          'virtues',
          'attributes',
          'abilities',
          'backgrounds',
          'influences',
          'powers',
          'health',
          'merits',
          'flaws',
          'rituals',
        ],
        default: "'abilities'",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'characters_traits',
      'type',
      new TableColumn({
        name: 'type',
        type: 'enum',
        enum: [
          'creature',
          'virtues',
          'attributes',
          'abilities',
          'backgrounds',
          'influences',
          'powers',
          'health',
          'merits',
          'flaws',
        ],
        default: "'abilities'",
      }),
    );
  }
}
