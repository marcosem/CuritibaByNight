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

        if (level > 1) {
          endBackground = line.indexOf(' x');
        } else {
          let influenceTag: string;

          if (line.indexOf('  ') >= 0) {
            influenceTag = '  ';
          } else if (line.indexOf(' Bureaucracy') >= 0) {
            influenceTag = ' Bureaucracy';
          } else if (line.indexOf(' Church') >= 0) {
            influenceTag = ' Church';
          } else if (line.indexOf(' Finance') >= 0) {
            influenceTag = ' Finance';
          } else if (line.indexOf(' Health') >= 0) {
            influenceTag = ' Health';
          } else if (line.indexOf(' High Society') >= 0) {
            influenceTag = 'High Society';
          } else if (line.indexOf(' Industry') >= 0) {
            influenceTag = ' Industry';
          } else if (line.indexOf(' Legal') >= 0) {
            influenceTag = ' Legal';
          } else if (line.indexOf(' Media') >= 0) {
            influenceTag = ' Media';
          } else if (line.indexOf(' Military') >= 0) {
            influenceTag = ' Military';
          } else if (line.indexOf(' Occult') >= 0) {
            influenceTag = ' Occult';
          } else if (line.indexOf(' Police') >= 0) {
            influenceTag = ' Police';
          } else if (line.indexOf(' Politics') >= 0) {
            influenceTag = ' Politics';
          } else if (line.indexOf(' Street') >= 0) {
            influenceTag = ' Street';
          } else if (line.indexOf(' Transportation') >= 0) {
            influenceTag = ' Transportation';
          } else if (line.indexOf(' Underworld') >= 0) {
            influenceTag = ' Underworld';
          } else if (line.indexOf(' University') >= 0) {
            influenceTag = ' University';
          } else {
            influenceTag = '';
          }

          if (influenceTag === '') {
            endBackground = line.length - 2;
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
      {
        const startSearchPos = line.indexOf(' O');
        if (startSearchPos >= 0) {
          const startBackground =
            line.indexOf('O ', startSearchPos) + 'O '.length;
          const level = line.indexOf('O ', startSearchPos) - startSearchPos;
          let endBackground: number;

          if (level > 1) {
            endBackground = line.indexOf(' x', startSearchPos);
          } else {
            let influenceTag: string;

            if (line.indexOf('  ', startSearchPos) >= 0) {
              influenceTag = '  ';
            } else if (line.indexOf(' Bureaucracy') >= 0) {
              influenceTag = ' Bureaucracy';
            } else if (line.indexOf(' Church') >= 0) {
              influenceTag = ' Church';
            } else if (line.indexOf(' Finance') >= 0) {
              influenceTag = ' Finance';
            } else if (line.indexOf(' Health') >= 0) {
              influenceTag = ' Health';
            } else if (line.indexOf(' High Society') >= 0) {
              influenceTag = 'High Society';
            } else if (line.indexOf(' Industry') >= 0) {
              influenceTag = ' Industry';
            } else if (line.indexOf(' Legal') >= 0) {
              influenceTag = ' Legal';
            } else if (line.indexOf(' Media') >= 0) {
              influenceTag = ' Media';
            } else if (line.indexOf(' Military') >= 0) {
              influenceTag = ' Military';
            } else if (line.indexOf(' Occult') >= 0) {
              influenceTag = ' Occult';
            } else if (line.indexOf(' Police') >= 0) {
              influenceTag = ' Police';
            } else if (line.indexOf(' Politics') >= 0) {
              influenceTag = ' Politics';
            } else if (line.indexOf(' Street') >= 0) {
              influenceTag = ' Street';
            } else if (line.indexOf(' Transportation') >= 0) {
              influenceTag = ' Transportation';
            } else if (line.indexOf(' Underworld') >= 0) {
              influenceTag = ' Underworld';
            } else if (line.indexOf(' University') >= 0) {
              influenceTag = ' University';
            } else {
              influenceTag = '';
            }

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

    default:
      backgroundTrait = undefined;
  }

  return backgroundTrait;
}
