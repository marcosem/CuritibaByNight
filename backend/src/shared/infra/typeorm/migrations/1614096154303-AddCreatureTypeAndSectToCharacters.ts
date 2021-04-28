import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddCreatureTypeAndSectToCharacters1614096154303
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'characters',
      new TableColumn({
        name: 'creature_type',
        type: 'enum',
        enum: [
          'Changeling',
          'Demon',
          'Fera',
          'Kuei-Jin',
          'Mage',
          'Mortal',
          'Mummy',
          'Vampire',
          'Werewolf',
          'Wraith',
          'Other',
        ],
        default: "'Vampire'",
      }),
    );

    await queryRunner.addColumn(
      'characters',
      new TableColumn({
        name: 'sect',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('characters', 'creature_type');
    await queryRunner.dropColumn('characters', 'sect');
  }
}
