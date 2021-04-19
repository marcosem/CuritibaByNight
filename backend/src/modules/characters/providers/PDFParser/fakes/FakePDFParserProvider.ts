import IPDFParserProvider, {
  IPDFParseDTO,
} from '@modules/characters/providers/PDFParser/models/IPDFParserProvider';

import Character from '@modules/characters/infra/typeorm/entities/Character';
import CharacterTrait from '@modules/characters/infra/typeorm/entities/CharacterTrait';

class FakePDFParserProvider implements IPDFParserProvider {
  public async parse(filename: string): Promise<IPDFParseDTO | undefined> {
    if (filename === '' || filename.indexOf('.pdf') < 0) {
      return undefined;
    }

    const char = new Character();
    char.file = filename;
    char.name = 'John Wick';
    char.experience = 1000;
    char.experience_total = 1000;
    char.clan = 'Assamite';
    char.title = 'Assassin';
    char.coterie = 'Assasins creed';
    char.creature_type = 'Vampire';
    char.sect = 'Independent';
    char.retainer_level = 0;

    const charTraits = [
      {
        trait: 'Willpower',
        level: 10,
        type: 'virtues',
      },
      {
        trait: 'Blood',
        level: 13,
        type: 'virtues',
      },
      {
        trait: 'Physical',
        level: 7,
        type: 'attributes',
      },
      {
        trait: 'Dodge',
        level: 2,
        type: 'abilities',
      },
      {
        trait: 'Resourses',
        level: 3,
        type: 'backgrounds',
      },
      {
        trait: 'Police',
        level: 1,
        type: 'influences',
      },
    ] as CharacterTrait[];

    return {
      character: char,
      charTraits,
    };
  }
}

export default FakePDFParserProvider;
