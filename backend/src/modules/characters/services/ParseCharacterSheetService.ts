import { injectable, inject } from 'tsyringe';
import Character from '@modules/characters/infra/typeorm/entities/Character';
import AppError from '@shared/errors/AppError';
import IPDFParserProvider from '@modules/characters/providers/PDFParser/models/IPDFParserProvider';

interface IRequestDTO {
  sheetFilename: string;
}

@injectable()
class ParseCharacterSheetService {
  constructor(
    @inject('PDFParserProvider')
    private pdfParserProvider: IPDFParserProvider,
  ) {}

  public async execute({
    sheetFilename,
  }: IRequestDTO): Promise<Character | undefined> {
    const character = await this.pdfParserProvider.parse(sheetFilename);

    if (!character) {
      throw new AppError('Unable to parse the character sheet file', 400);
    }

    return character;
  }
}

export default ParseCharacterSheetService;
