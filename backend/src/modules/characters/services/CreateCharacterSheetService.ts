import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Character from '@modules/characters/infra/typeorm/entities/Character';
import ICharactersRepository from '@modules/characters/repositories/ICharactersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

interface IRequestDTO {
  user_id: string;
  player_id?: string;
  char_name: string;
  char_xp: number;
  char_clan: string;
  char_title: string;
  char_coterie: string;
  is_npc: boolean;
  sheetFilename: string;
}

@injectable()
class CreateCharacterSheetService {
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
    player_id,
    char_name,
    char_xp,
    char_clan,
    char_title,
    char_coterie,
    is_npc,
    sheetFilename,
  }: IRequestDTO): Promise<Character> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      await this.storageProvider.deleteFile(sheetFilename, 'sheet');
      throw new AppError(
        'Only authenticated Storytellers can upload character sheets',
        401,
      );
    } else if (!user.storyteller) {
      await this.storageProvider.deleteFile(sheetFilename, 'sheet');
      throw new AppError(
        'Only authenticated Storytellers can upload character sheets',
        401,
      );
    }

    if (sheetFilename.indexOf('.pdf') === -1) {
      await this.storageProvider.deleteFile(sheetFilename, 'sheet');
      throw new AppError('File must be in PDF format', 400);
    }

    if (player_id && !is_npc) {
      const player = await this.usersRepository.findById(player_id);

      if (!player) {
        await this.storageProvider.deleteFile(sheetFilename, 'sheet');
        throw new AppError('Player not found', 400);
      }
    }

    const filename = await this.storageProvider.saveFile(
      sheetFilename,
      'sheet',
    );

    const char = await this.charactersRepository.create({
      user_id: !is_npc ? player_id : undefined,
      name: char_name,
      experience: char_xp,
      clan: char_clan,
      title: char_title,
      coterie: char_coterie,
      file: filename,
      npc: is_npc,
    });

    return char;
  }
}

export default CreateCharacterSheetService;
