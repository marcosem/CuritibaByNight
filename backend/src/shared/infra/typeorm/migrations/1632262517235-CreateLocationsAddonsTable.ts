import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateLocationsAddonsTable1632262517235
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'locations_addons',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'location_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'addon_id_current',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'addon_id_next',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'temp_ability',
            type: 'numeric',
            default: 0,
          },
          {
            name: 'temp_influence',
            type: 'numeric',
            default: 0,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'LocationId',
            referencedTableName: 'locations',
            referencedColumnNames: ['id'],
            columnNames: ['location_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'CurrentAddon',
            referencedTableName: 'addons',
            referencedColumnNames: ['id'],
            columnNames: ['addon_id_current'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'NextAddon',
            referencedTableName: 'addons',
            referencedColumnNames: ['id'],
            columnNames: ['addon_id_next'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('locations_addons');
  }
}
