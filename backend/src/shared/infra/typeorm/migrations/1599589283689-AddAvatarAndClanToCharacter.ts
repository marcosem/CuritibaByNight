import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddAvatarAndClanToCharacter1599589283689
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('characters', [
      new TableColumn({
        name: 'avatar',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'clan',
        type: 'varchar',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('characters', 'avatar');
    await queryRunner.dropColumn('characters', 'clan');
  }
}
