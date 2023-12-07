import CharacterTrait from '@modules/characters/infra/typeorm/entities/CharacterTrait';

export default function extractStatusTraits(
  line: string,
  statusList: CharacterTrait[],
): CharacterTrait[] {
  const currStatusList = statusList;

  if (line.indexOf('O ') >= 0) {
    const startStatus = line.indexOf('O ') + 'O '.length;
    const quantity = line.indexOf('O ') + 1;

    if (quantity <= 0) {
      return currStatusList;
    }

    const endTag = quantity > 1 ? ' x' : ' ';
    const endStatus = line.indexOf(endTag, startStatus + 1);
    const status = line.substring(startStatus, endStatus).trim();

    const startNotes = line.indexOf('(', endStatus) + 1;

    let notesList: string[] = [];
    if (startNotes >= 0 && startNotes - endStatus <= 5) {
      const endNotes = line.indexOf(')', startNotes);

      if (endNotes >= 0) {
        const notes = line.substring(startNotes, endNotes);

        if (quantity > 1) {
          notesList = notes.split(' / ');
        } else {
          notesList = [notes];
        }
      }
    }

    for (let i = 0; i < quantity; i += 1) {
      let myStatus = status;
      if (notesList.length >= i + 1) {
        myStatus = `${status}, ${notesList[i]}`;
      }

      const statusTrait = {
        trait: myStatus,
        level: 0,
        type: 'status',
      } as CharacterTrait;

      currStatusList.push(statusTrait);
    }
  }

  return currStatusList;
}
