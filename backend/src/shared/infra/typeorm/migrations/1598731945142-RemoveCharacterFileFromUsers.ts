import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class RemoveCharacterFileFromUsers1598731945142
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropColumn('users', 'character_file');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'character_file',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }
}
