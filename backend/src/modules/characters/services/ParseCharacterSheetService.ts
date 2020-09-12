import { injectable, inject } from 'tsyringe';
import Character from '@modules/characters/infra/typeorm/entities/Character';
import AppError from '@shared/errors/AppError';
import IPDFParserProvider from '@modules/characters/providers/PDFParser/models/IPDFParserProvider';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

interface IRequestDTO {
  sheetFilename: string;
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
    mimetype,
  }: IRequestDTO): Promise<Character | undefined> {
    if (mimetype !== 'application/pdf') {
      await this.storageProvider.deleteFile(sheetFilename, '');
      throw new AppError('File must be in PDF format', 400);
    }

    const character = await this.pdfParserProvider.parse(sheetFilename);

    if (!character) {
      await this.storageProvider.deleteFile(sheetFilename, '');
      throw new AppError('Unable to parse the character sheet file', 400);
    }

    return character;
  }
}

export default ParseCharacterSheetService;
