import CharacterTrait from '@modules/characters/infra/typeorm/entities/CharacterTrait';

export default function extractVirtuesTraits(
  line: string,
  creatureType: string,
): CharacterTrait[] {
  const virtuesTraits: CharacterTrait[] = [];

  if (line.indexOf('Willpower: ') >= 0) {
    const startWillpower = line.indexOf('Willpower: ') + 'Willpower: '.length;
    const endWillpower = line.indexOf('O', startWillpower) - 1;
    const willpower = parseInt(
      line.substring(startWillpower, endWillpower),
      10,
    );

    if (!Number.isNaN(willpower)) {
      const trait = {
        trait: 'Willpower',
        level: willpower,
        type: 'virtues',
      } as CharacterTrait;

      virtuesTraits.push(trait);
    }
  }

  switch (creatureType) {
    case 'Vampire':
      if (line.indexOf('Self-Control/Instinct: ') >= 0) {
        const startSelfControl =
          line.indexOf('Self-Control/Instinct: ') +
          'Self-Control/Instinct: '.length;
        const endSelfControl = line.indexOf('O', startSelfControl) - 1;
        const selfControl = parseInt(
          line.substring(startSelfControl, endSelfControl),
          10,
        );

        if (!Number.isNaN(selfControl)) {
          const trait = {
            trait: 'Self-Control/Instinct',
            level: selfControl,
            type: 'virtues',
          } as CharacterTrait;

          virtuesTraits.push(trait);
        }
      }

      if (line.indexOf('Conscience/Conviction: ') >= 0) {
        const startConscience =
          line.indexOf('Conscience/Conviction: ') +
          'Conscience/Conviction: '.length;
        const endConscience = line.indexOf('O', startConscience) - 1;
        const conscience = parseInt(
          line.substring(startConscience, endConscience),
          10,
        );

        if (!Number.isNaN(conscience)) {
          const trait = {
            trait: 'Conscience/Conviction',
            level: conscience,
            type: 'virtues',
          } as CharacterTrait;

          virtuesTraits.push(trait);
        }
      }

      if (line.indexOf('Courage: ') >= 0) {
        const startCourage = line.indexOf('Courage: ') + 'Courage: '.length;
        const endCourage = line.indexOf('O', startCourage) - 1;
        const courage = parseInt(line.substring(startCourage, endCourage), 10);

        if (!Number.isNaN(courage)) {
          const trait = {
            trait: 'Courage',
            level: courage,
            type: 'virtues',
          } as CharacterTrait;

          virtuesTraits.push(trait);
        }
      }
      break;

    case 'Mortal':
      if (line.indexOf('Humanity: ') >= 0) {
        const startMorality = line.indexOf('Humanity: ') + 'Humanity: '.length;
        const endMorality = line.indexOf('O', startMorality) - 1;
        const morality = parseInt(
          line.substring(startMorality, endMorality),
          10,
        );

        if (!Number.isNaN(morality)) {
          const trait = {
            trait: 'Morality: Humanity',
            level: morality,
            type: 'virtues',
          } as CharacterTrait;

          virtuesTraits.push(trait);
        }
      }

      if (line.indexOf('Self-Control: ') >= 0) {
        const startSelfControl =
          line.indexOf('Self-Control: ') + 'Self-Control: '.length;
        const endSelfControl = line.indexOf('O', startSelfControl) - 1;
        const selfControl = parseInt(
          line.substring(startSelfControl, endSelfControl),
          10,
        );

        if (!Number.isNaN(selfControl)) {
          const trait = {
            trait: 'Self-Control',
            level: selfControl,
            type: 'virtues',
          } as CharacterTrait;

          virtuesTraits.push(trait);
        }
      }

      if (line.indexOf('Conscience: ') >= 0) {
        const startConscience =
          line.indexOf('Conscience: ') + 'Conscience: '.length;
        const endConscience = line.indexOf('O', startConscience) - 1;
        const conscience = parseInt(
          line.substring(startConscience, endConscience),
          10,
        );

        if (!Number.isNaN(conscience)) {
          const trait = {
            trait: 'Conscience',
            level: conscience,
            type: 'virtues',
          } as CharacterTrait;

          virtuesTraits.push(trait);
        }
      }

      if (line.indexOf('Courage: ') >= 0) {
        const startCourage = line.indexOf('Courage: ') + 'Courage: '.length;
        const endCourage = line.indexOf('O', startCourage) - 1;
        const courage = parseInt(line.substring(startCourage, endCourage), 10);

        if (!Number.isNaN(courage)) {
          const trait = {
            trait: 'Courage',
            level: courage,
            type: 'virtues',
          } as CharacterTrait;

          virtuesTraits.push(trait);
        }
      }
      break;

    default:
      break;
  }

  return virtuesTraits;
}
