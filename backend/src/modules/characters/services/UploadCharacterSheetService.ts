import { injectable, inject } from 'tsyringe';
import path from 'path';
import fs from 'fs';
import User from '@modules/users/infra/typeorm/entities/User';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import IUserRepository from '@modules/users/repositories/IUsersRepository';

interface IRequestDTO {
  user_id: string;
  player_id: string;
  sheetFilename: string;
}

@injectable()
class UploadCharacterSheetService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,
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
      // Delete previews avatar
      const playerSheetFilePath = path.join(
        uploadConfig('sheet').directory,
        player.character_file,
      );

      const playerSheetFileExists = fs.existsSync(playerSheetFilePath);

      if (playerSheetFileExists) {
        await fs.promises.unlink(playerSheetFilePath);
      }
    }

    player.character_file = sheetFilename;
    await this.usersRepository.update(player);

    return player;
  }
}

export default UploadCharacterSheetService;
