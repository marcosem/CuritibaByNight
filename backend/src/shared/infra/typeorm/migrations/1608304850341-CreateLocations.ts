import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateLocations1608304850341
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'locations',
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
          },
          {
            name: 'description',
            type: 'text',
          },
          {
            name: 'address',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'latitude',
            type: 'decimal',
            scale: 8,
            precision: 11,
          },
          {
            name: 'longitude',
            type: 'decimal',
            scale: 8,
            precision: 11,
          },
          {
            name: 'elysium',
            type: 'boolean',
            default: false,
          },
          {
            name: 'type',
            type: 'enum',
            enum: [
              'haven',
              'castle',
              'holding',
              'mansion',
              'nightclub',
              'other',
            ],
            default: "'other'",
          },
          {
            name: 'level',
            type: 'numeric',
            default: 1,
          },
          {
            name: 'property',
            type: 'enum',
            enum: ['public', 'private', 'clan'],
            default: "'private'",
          },
          {
            name: 'clan',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'responsible',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'picture',
            type: 'varchar',
            isNullable: true,
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
    await queryRunner.dropTable('locations');
  }
}
