import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddTitleToInfluenceActionsTable1685213712549
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('influence_actions', [
      new TableColumn({
        name: 'title',
        type: 'varchar',
        default: "''",
        isNullable: false,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('influence_actions', 'title');
  }
}
