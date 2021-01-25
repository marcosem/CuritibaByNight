import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export default class AddRegnantForeignKeyToCharactersTable1611578159220
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'characters',
      new TableForeignKey({
        name: 'RegnantCharacter',
        referencedTableName: 'characters',
        referencedColumnNames: ['id'],
        columnNames: ['regnant'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('characters', 'RegnantCharacter');
  }
}
