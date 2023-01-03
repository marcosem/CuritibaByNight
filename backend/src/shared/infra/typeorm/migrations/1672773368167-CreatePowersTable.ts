import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreatePowersTable1672773368167
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'powers',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'long_name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'short_name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'level',
            type: 'numeric',
            default: -1,
          },
          {
            name: 'type',
            type: 'enum',
            enum: [
              'discipline',
              'combination',
              'ritual',
              'gift',
              'arcanoi',
              'spheres',
              'other',
            ],
            default: "'other'",
          },
          {
            name: 'origin',
            type: 'varchar',
            default: "''",
          },
          {
            name: 'requirements',
            type: 'varchar',
            default: "''",
          },
          {
            name: 'description',
            type: 'text',
          },
          {
            name: 'system',
            type: 'text',
          },
          {
            name: 'cost',
            type: 'numeric',
            default: 0,
          },
          {
            name: 'source',
            type: 'varchar',
            default: "''",
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
    await queryRunner.dropTable('powers');
  }
}
