import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddTitleAndCoterieToCharacters1609870081051
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('characters', [
      new TableColumn({
        name: 'title',
        type: 'varchar',
        default: "''",
      }),
      new TableColumn({
        name: 'coterie',
        type: 'varchar',
        default: "''",
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('characters', 'title');
    await queryRunner.dropColumn('characters', 'coterie');
  }
}
