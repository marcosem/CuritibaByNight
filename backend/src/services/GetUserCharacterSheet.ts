import { getCustomRepository } from 'typeorm';
import path from 'path';
import UsersRepository from '../repositories/UsersRepository';
import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';

interface RequestDTO {
  user_id: string;
}

class GetUserCharacterSheet {
  public async execute({ user_id }: RequestDTO): Promise<string> {
    const usersRepository = getCustomRepository(UsersRepository);

    const user = await usersRepository.findOne({
      where: { id: user_id },
    });

    if (!user) {
      throw new AppError(
        'Only authenticated users can load his character sheet',
        401,
      );
    }

    if (!user.character_file) {
      throw new AppError('User does not have a character sheet saved', 400);
    }

    const playerSheetFilePath = path.join(
      uploadConfig('sheet').directory,
      user.character_file,
    );

    return playerSheetFilePath;
  }
}

export default GetUserCharacterSheet;
