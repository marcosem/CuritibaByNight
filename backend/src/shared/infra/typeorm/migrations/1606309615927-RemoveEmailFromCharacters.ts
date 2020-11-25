import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class RemoveEmailFromCharacters1606309615927
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropColumn('characters', 'email');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.addColumn(
      'characters',
      new TableColumn({
        name: 'email',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }
}
