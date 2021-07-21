import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddSharedToLocationCharacterTable1626899218594
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'locations_characters',
      new TableColumn({
        name: 'shared',
        type: 'boolean',
        default: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('locations_characters', 'shared');
  }
}
