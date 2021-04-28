import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddTemporaryLevelToCharactersTraits1619557847240
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'characters_traits',
      new TableColumn({
        name: 'level_temp',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('characters_traits', 'level_temp');
  }
}
