import { injectable, inject } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

interface IRequestDTO {
  user_id: string;
  player_id: string;
  sheetFilename: string;
}

@injectable()
class UploadCharacterSheetService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    user_id,
    player_id,
    sheetFilename,
  }: IRequestDTO): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated Storytellers can upload character sheets',
        401,
      );
    } else if (!user.storyteller) {
      throw new AppError(
        'Only authenticated Storytellers can upload character sheets',
        401,
      );
    }

    if (sheetFilename.indexOf('.pdf') === -1) {
      throw new AppError('File must be in PDF format', 400);
    }

    const player = await this.usersRepository.findById(player_id);

    if (!player) {
      throw new AppError('Player not found', 400);
    }

    if (player.character_file) {
      this.storageProvider.deleteFile(player.character_file, 'sheet');
    }

    const filename = await this.storageProvider.saveFile(
      sheetFilename,
      'sheet',
    );

    player.character_file = filename;
    await this.usersRepository.update(player);

    return player;
  }
}

export default UploadCharacterSheetService;
