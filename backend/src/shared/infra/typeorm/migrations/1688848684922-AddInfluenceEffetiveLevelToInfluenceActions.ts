import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddInfluenceEffetiveLevelToInfluenceActions1688848684922
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('influence_actions', [
      new TableColumn({
        name: 'influence_effective_level',
        type: 'numeric',
        default: '0',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(
      'influence_actions',
      'influence_effective_level',
    );
  }
}
