import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateLocationsTraitsTable1657135068388
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'locations_traits',
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
            name: 'trait_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'level',
            type: 'numeric',
            default: 1,
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
            name: 'TraitId',
            referencedTableName: 'location_available_traits',
            referencedColumnNames: ['id'],
            columnNames: ['trait_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('locations_traits');
  }
}
