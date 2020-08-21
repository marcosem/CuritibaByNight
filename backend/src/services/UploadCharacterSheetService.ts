import { getCustomRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import User from '../models/User';
import UsersRepository from '../repositories/UsersRepository';
import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';

interface RequestDTO {
  user_id: string;
  player_id: string;
  sheetFilename: string;
}

class UploadCharacterSheetService {
  public async execute({
    user_id,
    player_id,
    sheetFilename,
  }: RequestDTO): Promise<User> {
    const usersRepository = getCustomRepository(UsersRepository);

    const user = await usersRepository.findOne(user_id);

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

    const player = await usersRepository.findOne({
      where: { id: player_id },
    });

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
    await usersRepository.save(player);

    return player;
  }
}

export default UploadCharacterSheetService;
