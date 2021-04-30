import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IPDFParserProvider, {
  IPDFParseDTO,
} from '@modules/characters/providers/PDFParser/models/IPDFParserProvider';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

interface IRequestDTO {
  sheetFilename: string;
  masqueradeLevel: number;
  mimetype: string;
}

@injectable()
class ParseCharacterSheetService {
  constructor(
    @inject('PDFParserProvider')
    private pdfParserProvider: IPDFParserProvider,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    sheetFilename,
    masqueradeLevel = 0,
    mimetype,
  }: IRequestDTO): Promise<IPDFParseDTO | undefined> {
    if (sheetFilename === '') {
      throw new AppError('You must send a character sheet file', 400);
    }

    if (mimetype !== 'application/pdf') {
      await this.storageProvider.deleteFile(sheetFilename, '');
      throw new AppError('File must be in PDF format', 400);
    }

    const parsedData = await this.pdfParserProvider.parse(
      sheetFilename,
      masqueradeLevel,
    );

    if (!parsedData) {
      await this.storageProvider.deleteFile(sheetFilename, '');
      throw new AppError('Unable to parse the character sheet file', 400);
    }

    // const { character, charTraits } = parsedData;

    return parsedData;
  }
}

export default ParseCharacterSheetService;
