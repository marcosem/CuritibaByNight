import { injectable, inject } from 'tsyringe';
// import User from '@modules/users/infra/typeorm/entities/User';
import Character from '@modules/characters/infra/typeorm/entities/Character';
import AppError from '@shared/errors/AppError';
// import IUsersRepository from '@modules/users/repositories/IUsersRepository';
// import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IPDFParserProvider from '@modules/characters/providers/PDFParser/models/IPDFParserProvider';

interface IRequestDTO {
  sheetFilename: string;
}

@injectable()
class ParseCharacterSheetService {
  constructor(
    // @inject('UsersRepository')
    // private usersRepository: IUsersRepository,
    // @inject('StorageProvider')
    // private storageProvider: IStorageProvider,
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
