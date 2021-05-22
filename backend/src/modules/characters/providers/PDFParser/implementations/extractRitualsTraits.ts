import CharacterTrait from '@modules/characters/infra/typeorm/entities/CharacterTrait';

export default function extractRitualsTraits(
  line: string,
  creature: string,
  ritualsList: CharacterTrait[],
): CharacterTrait[] {
  const currRitualsList = ritualsList;
  const ritual = '';

  switch (creature) {
    case 'Vampire':
      // Rituals
      break;

    case 'Werewolf':
      // Rites
      break;

    case 'Mage':
      // Rotes
      break;

    default:
  }

  return currRitualsList;
}
