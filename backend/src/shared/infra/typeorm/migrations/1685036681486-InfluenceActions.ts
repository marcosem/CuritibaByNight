import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class InfluenceActions1685036681486
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'influence_actions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'action_period',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'background',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'background_level',
            type: 'numeric',
            default: -1,
          },
          {
            name: 'influence',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'influence_level',
            type: 'numeric',
            default: 0,
          },
          {
            name: 'ability',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'ability_level',
            type: 'numeric',
            default: 0,
          },
          {
            name: 'endeavor',
            type: 'enum',
            enum: ['attack', 'defend', 'combine', 'raise capital', 'other'],
            default: "'other'",
          },
          {
            name: 'character_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'action_owner_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'storyteller_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'action',
            type: 'text',
          },
          {
            name: 'action_force',
            type: 'numeric',
            default: 0,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['sent', 'read', 'replied'],
            default: "'sent",
          },
          {
            name: 'st_reply',
            type: 'text',
          },
          {
            name: 'result',
            type: 'enum',
            enum: ['success', 'partial', 'fail', 'not evaluated'],
            default: "'not evaluated",
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
            name: 'CharacterId',
            referencedTableName: 'characters',
            referencedColumnNames: ['id'],
            columnNames: ['character_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'OwnerId',
            referencedTableName: 'characters',
            referencedColumnNames: ['id'],
            columnNames: ['action_owner_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'StorytellerId',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            columnNames: ['storyteller_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('influence_actions');
  }
}
