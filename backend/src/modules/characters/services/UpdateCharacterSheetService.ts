import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Character from '@modules/characters/infra/typeorm/entities/Character';
import ICharactersRepository from '@modules/characters/repositories/ICharactersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

interface IRequestDTO {
  user_id: string;
  char_id: string;
  char_name: string;
  char_xp: number;
  sheetFilename: string;
}

@injectable()
class UpdateCharacterSheetService {
  constructor(
    @inject('CharactersRepository')
    private charactersRepository: ICharactersRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    user_id,
    char_id,
    char_name,
    char_xp,
    sheetFilename,
  }: IRequestDTO): Promise<Character> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      await this.storageProvider.deleteFile(sheetFilename, 'sheet');
      throw new AppError(
        'Only authenticated Storytellers can update character sheets',
        401,
      );
    } else if (!user.storyteller) {
      await this.storageProvider.deleteFile(sheetFilename, 'sheet');
      throw new AppError(
        'Only authenticated Storytellers can update character sheets',
        401,
      );
    }

    if (sheetFilename.indexOf('.pdf') === -1) {
      await this.storageProvider.deleteFile(sheetFilename, 'sheet');
      throw new AppError('File must be in PDF format', 400);
    }

    const char = await this.charactersRepository.findById(char_id);

    if (!char) {
      await this.storageProvider.deleteFile(sheetFilename, 'sheet');
      throw new AppError('Character not found', 400);
    }

    if (char.file) {
      this.storageProvider.deleteFile(char.file, 'sheet');
    }

    const filename = await this.storageProvider.saveFile(
      sheetFilename,
      'sheet',
    );

    char.name = char_name;
    char.experience = char_xp;
    char.file = filename;

    await this.charactersRepository.update(char);

    return char;
  }
}

export default UpdateCharacterSheetService;
