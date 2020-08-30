import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class RemoveEmailICFromUsers1598732425170
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropColumn('users', 'email_ic');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'email_ic',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }
}
