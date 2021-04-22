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

    case 'Wraith':
      if (line.indexOf('Pathos: ') >= 0) {
        const startPathos = line.indexOf('Pathos: ') + 'Pathos: '.length;
        const endPathos = line.indexOf('O', startPathos) - 1;
        const pathos = parseInt(line.substring(startPathos, endPathos), 10);

        if (!Number.isNaN(pathos)) {
          const trait = {
            trait: 'Pathos',
            level: pathos,
            type: 'creature',
          } as CharacterTrait;

          creatureTraits.push(trait);
        }
      }

      if (line.indexOf('Corpus: ') >= 0) {
        const startCorpus = line.indexOf('Corpus: ') + 'Corpus: '.length;
        const endCorpus = line.indexOf('O', startCorpus) - 1;

        if (endCorpus >= 0) {
          const corpus = parseInt(line.substring(startCorpus, endCorpus), 10);

          if (!Number.isNaN(corpus)) {
            const trait = {
              trait: 'Corpus',
              level: corpus,
              type: 'creature',
            } as CharacterTrait;

            creatureTraits.push(trait);
          }
        }
      }
      break;

    case 'Mage':
      if (line.indexOf('Arete: ') >= 0) {
        const startArete = line.indexOf('Arete: ') + 'Arete: '.length;
        const endArete = line.indexOf('O', startArete) - 1;
        const arete = parseInt(line.substring(startArete, endArete), 10);

        if (!Number.isNaN(arete)) {
          const trait = {
            trait: 'Arete',
            level: arete,
            type: 'creature',
          } as CharacterTrait;

          creatureTraits.push(trait);
        }
      }

      if (line.indexOf('Quintessence: ') >= 0) {
        const startQuintessence =
          line.indexOf('Quintessence: ') + 'Quintessence: '.length;
        const endQuintessence = line.indexOf('O', startQuintessence) - 1;

        if (endQuintessence >= 0) {
          const quintessence = parseInt(
            line.substring(startQuintessence, endQuintessence),
            10,
          );

          if (!Number.isNaN(quintessence)) {
            const trait = {
              trait: 'Quintessence',
              level: quintessence,
              type: 'creature',
            } as CharacterTrait;

            creatureTraits.push(trait);
          }
        }
      }

      if (line.indexOf('Paradox: ') >= 0) {
        const startParadox = line.indexOf('Paradox: ') + 'Paradox: '.length;
        const endParadox = line.indexOf('O', startParadox) - 1;

        if (endParadox >= 0) {
          const paradox = parseInt(
            line.substring(startParadox, endParadox),
            10,
          );

          if (!Number.isNaN(paradox)) {
            const trait = {
              trait: 'Paradox',
              level: paradox,
              type: 'creature',
            } as CharacterTrait;

            creatureTraits.push(trait);
          }
        }
      }
      break;

    case 'Werewolf':
      if (line.indexOf('Rank: ') >= 0) {
        const startRank = line.indexOf('Rank: ') + 'Rank: '.length;
        const endRank = line.indexOf('Nature:', startRank) - 1;
        const rank = line.substring(startRank, endRank);
        const rankList = [
          'Cub',
          'Cliath',
          'Fostern',
          'Adren',
          'Athro',
          'Elder',
          'Legend',
        ];

        const level = rankList.indexOf(rank);

        if (level >= 0) {
          const trait = {
            trait: 'Rank',
            level,
            type: 'creature',
          } as CharacterTrait;

          creatureTraits.push(trait);
        }
      }

      if (line.indexOf('Rage: ') >= 0) {
        const startRage = line.indexOf('Rage: ') + 'Rage: '.length;
        const endRage = line.indexOf('O', startRage) - 1;

        if (endRage >= 0) {
          const rage = parseInt(line.substring(startRage, endRage), 10);

          if (!Number.isNaN(rage)) {
            const trait = {
              trait: 'Rage',
              level: rage,
              type: 'creature',
            } as CharacterTrait;

            creatureTraits.push(trait);
          }
        }
      }

      if (line.indexOf('Gnosis: ') >= 0) {
        const startGnosis = line.indexOf('Gnosis: ') + 'Gnosis: '.length;
        const endGnosis = line.indexOf('O', startGnosis) - 1;

        if (endGnosis >= 0) {
          const gnosis = parseInt(line.substring(startGnosis, endGnosis), 10);

          if (!Number.isNaN(gnosis)) {
            const trait = {
              trait: 'Gnosis',
              level: gnosis,
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
