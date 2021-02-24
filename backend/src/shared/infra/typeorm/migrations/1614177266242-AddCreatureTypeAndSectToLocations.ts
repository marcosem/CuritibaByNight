import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddCreatureTypeAndSectToLocations1614177266242
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'locations',
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
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'locations',
      new TableColumn({
        name: 'sect',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.changeColumn(
      'locations',
      'property',
      new TableColumn({
        name: 'property',
        type: 'enum',
        enum: ['public', 'private', 'clan', 'creature', 'sect'],
        default: "'private'",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'locations',
      'property',
      new TableColumn({
        name: 'property',
        type: 'enum',
        enum: ['public', 'private', 'clan'],
        default: "'private'",
      }),
    );

    await queryRunner.dropColumn('locations', 'creature_type');
    await queryRunner.dropColumn('locations', 'sect');
  }
}
