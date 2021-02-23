import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  // getRepository,
  // Like,
  // Not,
} from 'typeorm';
// import Character from '@modules/characters/infra/typeorm/entities/Character';

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

    /*
    const charRepository = getRepository(Character);
    const vampires = await charRepository.find({
      where: [
        { clan: Not(Like('%Mortal%')) },
        { clan: Not(Like('%Ghoul%')) },
        { clan: Not(Like('%Wraith%')) },
      ],
    });

    const vampiresUpdated = vampires.map(vamp => {
      const newVamp = vamp;
      newVamp.creature_type = 'Vampire';
      return newVamp;
    });

    await charRepository.save(vampiresUpdated);

    const mortals = await charRepository.find({
      where: [{ clan: Like('%Mortal%') }, { clan: Like('%Ghoul%') }],
    });

    const mortalsUpdated = mortals.map(mortal => {
      const newMortal = mortal;
      newMortal.creature_type = 'Mortal';
      return newMortal;
    });

    await charRepository.save(mortalsUpdated);

    const wraiths = await charRepository.find({
      where: { clan: Like('%Wraith%') },
    });

    const wraithsUpdated = wraiths.map(wraith => {
      const newWraith = wraith;
      newWraith.creature_type = 'Wraith';
      newWraith.clan = wraith.clan.replace('Wraith: ', '');
      return newWraith;
    });

    await charRepository.save(wraithsUpdated);
    */

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
    /*
    const charRepository = getRepository(Character);
    const wraiths = await charRepository.find({
      where: { creature_type: 'Wraith' },
    });

    const wraithsUpdated = wraiths.map(wraith => {
      const newWraith = wraith;
      newWraith.clan = `Wraith: ${wraith.clan}`;
      return newWraith;
    });

    await charRepository.save(wraithsUpdated);
    */

    await queryRunner.dropColumn('characters', 'creature_type');
    await queryRunner.dropColumn('characters', 'sect');
  }
}
