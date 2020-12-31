import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddNPCFieldToCharactersTable1609431070626
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'characters',
      new TableColumn({
        name: 'npc',
        type: 'boolean',
        default: false,
      }),
    );

    await queryRunner.changeColumn(
      'characters',
      'user_id',
      new TableColumn({
        name: 'user_id',
        type: 'uuid',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('characters', 'npc');

    await queryRunner.changeColumn(
      'characters',
      'user_id',
      new TableColumn({
        name: 'user_id',
        type: 'uuid',
        isNullable: false,
      }),
    );
  }
}
