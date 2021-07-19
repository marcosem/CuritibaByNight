import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateAddonsTable1626636345875
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'addons',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'level',
            type: 'numeric',
            default: 1,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'defense',
            type: 'numeric',
            default: 0,
          },
          {
            name: 'surveillance',
            type: 'numeric',
            default: 0,
          },
          {
            name: 'req_background',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'req_merit',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'req_influence',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'req_other',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'req_addon_1',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'req_addon_2',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'req_addon_3',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'ability',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'ability_qty',
            type: 'numeric',
            default: 0,
          },
          {
            name: 'influence',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'influence_qty',
            type: 'numeric',
            default: 0,
          },
          {
            name: 'time_qty',
            type: 'numeric',
            default: 0,
          },
          {
            name: 'time_type',
            type: 'enum',
            enum: ['days', 'weeks', 'months', 'years'],
            default: "'weeks'",
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
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('addons');
  }
}
