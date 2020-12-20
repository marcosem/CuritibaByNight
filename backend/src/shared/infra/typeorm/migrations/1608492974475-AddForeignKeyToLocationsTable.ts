import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export default class AddForeignKeyToLocationsTable1608492974475
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'locations',
      new TableForeignKey({
        name: 'LocationCharacter',
        referencedTableName: 'characters',
        referencedColumnNames: ['id'],
        columnNames: ['responsible'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('locations', 'LocationCharacter');
  }
}
