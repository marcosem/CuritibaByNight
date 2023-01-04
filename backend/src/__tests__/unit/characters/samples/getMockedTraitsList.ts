import ICreateCharacterTraitDTO from '@modules/characters/dtos/ICreateCharacterTraitDTO';

interface IMockedArgument {
  id: string;
  creature_type: string;
  clan: string;
}

export default function getMockedTraitsList(
  chars: IMockedArgument[],
): ICreateCharacterTraitDTO[] {
  let mockedDataList: ICreateCharacterTraitDTO[] = [];

  chars.forEach(char => {
    let data: ICreateCharacterTraitDTO[];

    switch (char.creature_type) {
      case 'Vampire':
        data = [
          {
            trait: 'Blood',
            character_id: char.id,
            level: 10,
            type: 'creature',
            characterId: char,
          } as ICreateCharacterTraitDTO,
          {
            trait: 'Willpower',
            character_id: char.id,
            level: 6,
            type: 'virtues',
            characterId: char,
          } as ICreateCharacterTraitDTO,
          {
            trait: 'Personal Masquerade',
            character_id: char.id,
            level: 10,
            level_temp:
              'empty|empty|empty|empty|empty|empty|empty|empty|empty|empty',
            type: 'creature',
            characterId: char,
          } as ICreateCharacterTraitDTO,
          {
            trait: 'Alter Simple Creature',
            character_id: char.id,
            level: 2,
            type: 'rituals',
            characterId: char,
          } as ICreateCharacterTraitDTO,
          {
            trait: 'Animalism',
            character_id: char.id,
            level: 2,
            type: 'powers',
            characterId: char,
          } as ICreateCharacterTraitDTO,
          {
            trait: 'Animalism',
            character_id: char.id,
            level: 3,
            type: 'powers',
            characterId: char,
          } as ICreateCharacterTraitDTO,
          {
            trait: "Ventrue: Denial of Aphrodite's Favor",
            character_id: char.id,
            level: 0,
            type: 'powers',
            characterId: char,
          } as ICreateCharacterTraitDTO,
        ];
        break;
      case 'Mage':
        data = [
          {
            trait: 'Life',
            character_id: char.id,
            level: 2,
            type: 'powers',
            characterId: char,
          } as ICreateCharacterTraitDTO,
          {
            trait: 'Whereami?',
            character_id: char.id,
            level: 1,
            type: 'rituals',
            characterId: char,
          } as ICreateCharacterTraitDTO,
        ];
        break;
      case 'Wraith':
        data = [
          {
            trait: 'Argos',
            character_id: char.id,
            level: 2,
            type: 'powers',
            characterId: char,
          } as ICreateCharacterTraitDTO,
        ];
        break;
      case 'Werewolf':
        data = [
          {
            trait: "Get of Fenris: Halt the Coward's Flight",
            character_id: char.id,
            level: 3,
            type: 'powers',
            characterId: char,
          } as ICreateCharacterTraitDTO,
        ];
        break;
      case 'Mortal':
        data = [
          {
            trait: 'Potence',
            character_id: char.id,
            level: 1,
            type: 'powers',
            characterId: char,
          } as ICreateCharacterTraitDTO,
          {
            trait: 'Auspex',
            character_id: char.id,
            level: 2,
            type: 'powers',
            characterId: char,
          } as ICreateCharacterTraitDTO,
        ];
        break;
      default:
        data = [
          {
            trait: 'Custom Power',
            character_id: char.id,
            level: 3,
            type: 'powers',
            characterId: undefined,
          } as ICreateCharacterTraitDTO,
        ];
        break;
    }

    mockedDataList = mockedDataList.concat(data);
  });

  return mockedDataList;
}
