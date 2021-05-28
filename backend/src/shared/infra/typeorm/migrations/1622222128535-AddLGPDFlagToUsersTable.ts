import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddLGPDFlagToUsersTable1622222128535
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('users', [
      new TableColumn({
        name: 'lgpd_acceptance_date',
        type: 'timestamp',
        default: null,
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'lgpd_acceptance_date');
  }
}
