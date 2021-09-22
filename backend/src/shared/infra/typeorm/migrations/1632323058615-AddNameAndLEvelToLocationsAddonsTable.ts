import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddNameAndLEvelToLocationsAddonsTable1632323058615
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('locations_addons', [
      new TableColumn({
        name: 'addon_name',
        type: 'varchar',
        isNullable: false,
      }),
      new TableColumn({
        name: 'addon_level',
        type: 'numeric',
        default: 0,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('locations_addons', 'addon_name');
    await queryRunner.dropColumn('locations_addons', 'addon_level');
  }
}
