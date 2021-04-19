export default function extractSingleBackground(
  line: string,
  creatureType: string,
): string {
  let background: string;

  if (line.indexOf('O ') >= 0) {
    const startBackground = line.indexOf('O ') + 'O '.length;

    switch (creatureType) {
      case 'Vampire':
        {
          let endBackground: number;
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

          background = line.substring(startBackground, endBackground);
        }
        break;

      default:
        background = '';
    }
  } else {
    background = '';
  }

  return background;
}
