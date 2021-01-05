import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateRelationLocationCharacter1608642277322
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'locations_characters',
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
            name: 'character_id',
            type: 'uuid',
            isNullable: false,
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
            name: 'CharacterId',
            referencedTableName: 'characters',
            referencedColumnNames: ['id'],
            columnNames: ['character_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('locations_characters');
  }
}
