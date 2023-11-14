import CharacterTrait from '@modules/characters/infra/typeorm/entities/CharacterTrait';

export default function extractBackgroundsTraits(
  line: string,
  creatureType: string,
): CharacterTrait | undefined {
  let background: string;
  let backgroundTrait: CharacterTrait | undefined;

  switch (creatureType) {
    case 'Vampire':
      if (line.indexOf('O ') >= 0) {
        const startBackground = line.indexOf('O ') + 'O '.length;
        const level = line.indexOf('O ') + 1;
        let endBackground: number;

        /*
        console.log({
          line,
          level,
        });
        */

        if (level <= 0) {
          backgroundTrait = undefined;
          break;
        } else if (level > 1) {
          endBackground = line.indexOf(' x');
        } else {
          let influenceTag = '';

          const influencesList = [
            'Bureaucracy',
            'Church',
            'Finance',
            'Health',
            'High Society',
            'Industry',
            'Legal',
            'Media',
            'Occult',
            'Police',
            'Politics',
            'Street',
            'Transportation',
            'Underworld',
            'University',
            'Military',
          ];

          if (line.lastIndexOf('   ') >= 0) {
            influenceTag = '   ';
          } else {
            influencesList.some(influence => {
              if (line.lastIndexOf(` ${influence}`) >= 0) {
                influenceTag = ` ${influence}`;
                return true;
              }
              return false;
            });

            if (influenceTag === '' && line.lastIndexOf('  ') >= 0) {
              influenceTag = '  ';
            }
          }

          if (influenceTag === '') {
            endBackground = line.length - 3;
          } else {
            endBackground = line.indexOf(influenceTag);
          }

          const bracket = line.indexOf(' (');
          if (bracket >= 0 && bracket < endBackground) {
            endBackground = bracket;
          }
        }

        background = line.substring(startBackground, endBackground);

        backgroundTrait = {
          trait: background,
          level,
          type: 'backgrounds',
        } as CharacterTrait;
      } else {
        backgroundTrait = undefined;
      }
      break;

    case 'Mortal':
    case 'Wraith':
      {
        const startSearchPos = line.indexOf(' O');
        if (startSearchPos >= 0) {
          const startBackground =
            line.indexOf('O ', startSearchPos) + 'O '.length;
          const level = line.indexOf('O ', startSearchPos) - startSearchPos;
          let endBackground: number;

          if (level <= 0) {
            backgroundTrait = undefined;
            break;
          } else if (level > 1) {
            endBackground = line.indexOf(' x', startSearchPos);
          } else {
            let influenceTag = '';

            const influencesList = [
              'Bureaucracy',
              'Church',
              'Finance',
              'Health',
              'High Society',
              'Industry',
              'Legal',
              'Media',
              'Occult',
              'Police',
              'Politics',
              'Street',
              'Transportation',
              'Underworld',
              'University',
              'Military',
            ];

            influencesList.some(influence => {
              if (line.lastIndexOf(` ${influence}`) >= 0) {
                influenceTag = ` ${influence}`;
                return true;
              }
              return false;
            });

            if (influenceTag === '') {
              endBackground = line.length - 2;
            } else {
              endBackground = line.indexOf(influenceTag);
            }

            const bracket = line.indexOf(' (', startSearchPos);
            if (bracket >= 0 && bracket < endBackground) {
              endBackground = bracket;
            }
          }

          background = line.substring(startBackground, endBackground);

          backgroundTrait = {
            trait: background,
            level,
            type: 'backgrounds',
          } as CharacterTrait;
        } else {
          backgroundTrait = undefined;
        }
      }
      break;

    case 'Mage':
      if (line.indexOf('O ') >= 0) {
        const startBackground = line.indexOf('O ') + 'O '.length;
        const level = line.indexOf('O ') + 1;
        let endBackground: number;

        if (level <= 0) {
          backgroundTrait = undefined;
          break;
        } else if (level > 1) {
          endBackground = line.indexOf(' x');
        } else {
          let spheresTag = '';

          const mageSpheres = [
            'Correspondence',
            'Dimensional Science',
            'Entropy',
            'Forces',
            'Life',
            'Matter',
            'Mind',
            'Prime',
            'Spirit',
            'Time',
          ];

          mageSpheres.some(sphere => {
            if (line.lastIndexOf(` ${sphere}`) >= 0) {
              spheresTag = ` ${sphere}`;
              return true;
            }
            return false;
          });

          if (spheresTag === '') {
            endBackground = line.length - 2;
          } else {
            endBackground = line.indexOf(spheresTag);
          }

          const bracket = line.indexOf(' (');
          if (bracket >= 0 && bracket < endBackground) {
            endBackground = bracket;
          }
        }

        background = line.substring(startBackground, endBackground);

        backgroundTrait = {
          trait: background,
          level,
          type: 'backgrounds',
        } as CharacterTrait;
      } else {
        backgroundTrait = undefined;
      }
      break;

    case 'Werewolf':
      if (line.indexOf('O ') >= 0) {
        const startBackground = line.indexOf('O ') + 'O '.length;
        const level = line.indexOf('O ') + 1;
        let endBackground: number;

        if (level <= 0) {
          backgroundTrait = undefined;
          break;
        } else if (level > 1) {
          endBackground = line.indexOf(' x');
        } else {
          let ritesTag = '';

          const werewolfRites = [
            'Accord',
            'Caern',
            'Death',
            'Frontier',
            'Hengeyokai',
            'Minor',
            'Mystic',
            'Punishment',
            'Pure Ones',
            'Renown',
            'Seasonal',
            'Tribal',
          ];

          werewolfRites.some(rites => {
            if (line.indexOf(` ${rites}: `) >= 0) {
              ritesTag = ` ${rites}: `;
              return true;
            }
            return false;
          });

          if (ritesTag === '') {
            endBackground = line.length - 2;
          } else {
            endBackground = line.indexOf(ritesTag);
          }

          const bracket = line.indexOf(' (');
          if (bracket >= 0 && bracket < endBackground) {
            endBackground = bracket;
          }
        }

        background = line.substring(startBackground, endBackground).trim();

        backgroundTrait = {
          trait: background,
          level,
          type: 'backgrounds',
        } as CharacterTrait;
      } else {
        backgroundTrait = undefined;
      }
      break;

    default:
      backgroundTrait = undefined;
  }

  return backgroundTrait;
}
