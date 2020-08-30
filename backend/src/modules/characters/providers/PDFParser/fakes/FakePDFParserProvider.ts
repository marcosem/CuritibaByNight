import IPDFParserProvider from '@modules/characters/providers/PDFParser/models/IPDFParserProvider';
import Character from '@modules/characters/infra/typeorm/entities/Character';

class FakePDFParserProvider implements IPDFParserProvider {
  public async parse(filename: string): Promise<Character | undefined> {
    if (filename === '') {
      return undefined;
    }

    const char = new Character();
    char.file = filename;
    char.name = 'John Wick';
    char.experience = 1000;

    return char;
  }
}

export default FakePDFParserProvider;
