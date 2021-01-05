import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddMysticalAndUpdateTypeFieldOnLocations1609855296787
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'locations',
      new TableColumn({
        name: 'mystical_level',
        type: 'numeric',
        default: 0,
      }),
    );

    await queryRunner.changeColumn(
      'locations',
      'type',
      new TableColumn({
        name: 'type',
        type: 'enum',
        enum: [
          'haven',
          'airport',
          'castle',
          'holding',
          'mansion',
          'nightclub',
          'university',
          'other',
        ],
        default: "'other'",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('locations', 'mystical_level');

    await queryRunner.changeColumn(
      'locations',
      'type',
      new TableColumn({
        name: 'type',
        type: 'enum',
        enum: ['haven', 'castle', 'holding', 'mansion', 'nightclub', 'other'],
        default: "'other'",
      }),
    );
  }
}
