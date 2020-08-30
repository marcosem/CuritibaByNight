import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export default class AddForeignKeyToCharactersTable1598817733375
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'characters',
      new TableForeignKey({
        name: 'CharacterUser',
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        columnNames: ['user_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('characters', 'CharacterUser');
  }
}
