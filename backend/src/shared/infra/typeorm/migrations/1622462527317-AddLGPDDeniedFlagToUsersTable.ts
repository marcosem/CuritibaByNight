import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddLGPDDeniedFlagToUsersTable1622462527317
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('users', [
      new TableColumn({
        name: 'lgpd_denial_date',
        type: 'timestamp',
        default: null,
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'lgpd_denial_date');
  }
}
