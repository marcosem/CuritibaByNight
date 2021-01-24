import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddTotalExperienceAndRetainerFieldsToCharacters1611423797085
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('characters', [
      new TableColumn({
        name: 'experience_total',
        type: 'numeric',
        default: 0,
      }),
      new TableColumn({
        name: 'regnant',
        type: 'uuid',
        isNullable: true,
      }),
      new TableColumn({
        name: 'retainer_level',
        type: 'numeric',
        default: 0,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('characters', 'experience_total');
    await queryRunner.dropColumn('characters', 'regnant');
    await queryRunner.dropColumn('characters', 'retainer_level');
  }
}
