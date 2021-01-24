import IPDFParserProvider from '@modules/characters/providers/PDFParser/models/IPDFParserProvider';
import Character from '@modules/characters/infra/typeorm/entities/Character';

class FakePDFParserProvider implements IPDFParserProvider {
  public async parse(filename: string): Promise<Character | undefined> {
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
    char.retainer_level = 0;

    return char;
  }
}

export default FakePDFParserProvider;
