import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateCharactersTraitsTable1618839260145
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'characters_traits',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'character_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'trait',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'level',
            type: 'numeric',
            default: 1,
          },
          {
            name: 'type',
            type: 'enum',
            enum: [
              'creature',
              'virtues',
              'attributes',
              'abilities',
              'backgrounds',
              'influences',
            ],
            default: "'abilities'",
          },
        ],
        foreignKeys: [
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
    await queryRunner.dropTable('characters_traits');
  }
}
