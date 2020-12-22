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

/*
import { MigrationInterface, QueryRunner } from 'typeorm';

export default class RelationLocationCharacter1608639230484
  implements MigrationInterface {
  name = 'RelationLocationCharacter1608639230484';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "locations_awareness_list_characters" ("locationsId" uuid NOT NULL, "charactersId" uuid NOT NULL, CONSTRAINT "PK_c915160d4fd631a412e56e4ca20" PRIMARY KEY ("locationsId", "charactersId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_843b3b6e28c380682ca73732a3" ON "locations_awareness_list_characters" ("locationsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e7f1c1f97b61f6456bc183b8f1" ON "locations_awareness_list_characters" ("charactersId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "locations_awareness_list_characters" ADD CONSTRAINT "FK_843b3b6e28c380682ca73732a3e" FOREIGN KEY ("locationsId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "locations_awareness_list_characters" ADD CONSTRAINT "FK_e7f1c1f97b61f6456bc183b8f1f" FOREIGN KEY ("charactersId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "locations_awareness_list_characters" DROP CONSTRAINT "FK_e7f1c1f97b61f6456bc183b8f1f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "locations_awareness_list_characters" DROP CONSTRAINT "FK_843b3b6e28c380682ca73732a3e"`,
    );

    await queryRunner.query(`DROP INDEX "IDX_e7f1c1f97b61f6456bc183b8f1"`);
    await queryRunner.query(`DROP INDEX "IDX_843b3b6e28c380682ca73732a3"`);
    await queryRunner.query(`DROP TABLE "locations_awareness_list_characters"`);
  }
}

*/
