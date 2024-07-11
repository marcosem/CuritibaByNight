import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddNegativeTraitsToCharacterTraitsTable1720552914149
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
          'neg_attributes',
          'abilities',
          'backgrounds',
          'influences',
          'powers',
          'health',
          'merits',
          'flaws',
          'rituals',
          'status',
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
          'rituals',
          'status',
        ],
        default: "'abilities'",
      }),
    );
  }
}
