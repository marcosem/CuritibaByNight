import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddSituationFieldToCharacters1599937182580
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'characters',
      new TableColumn({
        name: 'situation',
        type: 'varchar',
        default: `'active'`,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('characters', 'situation');
  }
}
