import IPDFParserProvider, {
  IPDFParseDTO,
} from '@modules/characters/providers/PDFParser/models/IPDFParserProvider';

import Character from '@modules/characters/infra/typeorm/entities/Character';
import CharacterTrait from '@modules/characters/infra/typeorm/entities/CharacterTrait';

class FakePDFParserProvider implements IPDFParserProvider {
  public async parse(
    filename: string,
    masqueradeLevel = 0,
  ): Promise<IPDFParseDTO | undefined> {
    if (filename === '' || filename.indexOf('.pdf') < 0) {
      return undefined;
    }

    let bloodPenalty = masqueradeLevel;
    let influencePenalty = Math.floor(masqueradeLevel / 2);
    let backgroundPenalty = Math.floor(masqueradeLevel / 3);

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

    let bloodTemp = '';
    let influenceTemp = '';
    let backgroundTemp = '';

    if (bloodPenalty >= 13) {
      bloodPenalty = 12;
    }

    for (let i = 0; i < 13; i += 1) {
      if (bloodPenalty > 0) {
        if (i === 0) {
          bloodTemp = 'Masquerade';
        } else {
          bloodTemp = `${bloodTemp}|Masquerade`;
        }
        bloodPenalty -= 1;
      } else if (i === 0) {
        bloodTemp = 'full';
      } else {
        bloodTemp = `${bloodTemp}|full`;
      }
    }

    if (influencePenalty >= 1) {
      influencePenalty = 1;
    }

    for (let i = 0; i < 3; i += 1) {
      if (influencePenalty > 0) {
        if (i === 0) {
          influenceTemp = 'Masquerade';
        } else {
          influenceTemp = `${influenceTemp}|Masquerade`;
        }
        influencePenalty -= 1;
      } else if (i === 0) {
        influenceTemp = 'full';
      } else {
        influenceTemp = `${influenceTemp}|full`;
      }
    }

    if (backgroundPenalty >= 1) {
      backgroundPenalty = 1;
    }

    for (let i = 0; i < 3; i += 1) {
      if (backgroundPenalty > 0) {
        if (i === 0) {
          backgroundTemp = 'Masquerade';
        } else {
          backgroundTemp = `${backgroundTemp}|Masquerade`;
        }
        backgroundPenalty -= 1;
      } else if (i === 0) {
        backgroundTemp = 'full';
      } else {
        backgroundTemp = `${backgroundTemp}|full`;
      }
    }

    const charTraits = [
      {
        trait: 'Willpower',
        level: 10,
        type: 'virtues',
      },
      {
        trait: 'Blood',
        level: 13,
        level_temp: bloodTemp,
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
        level_temp: backgroundTemp,
        type: 'backgrounds',
      },
      {
        trait: 'Police',
        level: 1,
        level_Temp: influenceTemp,
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
