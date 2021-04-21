import CharacterTrait from '@modules/characters/infra/typeorm/entities/CharacterTrait';

export default function extractCreatureTraits(
  line: string,
  creatureType: string,
): CharacterTrait[] {
  const creatureTraits: CharacterTrait[] = [];

  switch (creatureType) {
    case 'Vampire':
      if (line.indexOf('Blood: ') >= 0) {
        const startBlood = line.indexOf('Blood: ') + 'Blood: '.length;
        const endBlood = line.indexOf('O', startBlood) - 1;
        const blood = parseInt(line.substring(startBlood, endBlood), 10);

        if (!Number.isNaN(blood)) {
          const trait = {
            trait: 'Blood',
            level: blood,
            type: 'creature',
          } as CharacterTrait;

          creatureTraits.push(trait);
        }
      }
      break;

    case 'Mortal':
      if (line.indexOf('Blood: ') >= 0) {
        const startBlood = line.indexOf('Blood: ') + 'Blood: '.length;
        const endBlood = line.indexOf('O', startBlood) - 1;
        const blood = parseInt(line.substring(startBlood, endBlood), 10);

        if (!Number.isNaN(blood)) {
          const trait = {
            trait: 'Blood',
            level: blood,
            type: 'creature',
          } as CharacterTrait;

          creatureTraits.push(trait);
        }
      }

      if (line.indexOf('True Faith: ') >= 0) {
        const startTrueFaith =
          line.indexOf('True Faith: ') + 'True Faith: '.length;
        const endTrueFaith = line.indexOf('O', startTrueFaith) - 1;
        const maxEnd = startTrueFaith + 4;

        if (endTrueFaith >= 0 && endTrueFaith < maxEnd) {
          const trueFaith = parseInt(
            line.substring(startTrueFaith, endTrueFaith),
            10,
          );

          if (!Number.isNaN(trueFaith)) {
            const trait = {
              trait: 'True Faith',
              level: trueFaith,
              type: 'creature',
            } as CharacterTrait;

            creatureTraits.push(trait);
          }
        }
      }
      break;

    default:
      break;
  }

  return creatureTraits;
}
