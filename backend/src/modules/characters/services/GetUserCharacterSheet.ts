import { getCustomRepository } from 'typeorm';
import path from 'path';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';

interface IRequestDTO {
  user_id: string;
  player_id: string;
}

class GetUserCharacterSheet {
  public async execute({ user_id, player_id }: IRequestDTO): Promise<string> {
    const usersRepository = getCustomRepository(UsersRepository);

    const user = await usersRepository.findOne({
      where: { id: user_id },
    });

    if (!user) {
      throw new AppError(
        'Only authenticated users can load his character sheet',
        401,
      );
    } else if (!user.storyteller && user_id !== player_id) {
      throw new AppError(
        'Only authenticated Storytellers can get other players character sheets',
        401,
      );
    }

    const player = await usersRepository.findOne({
      where: { id: player_id },
    });

    if (!player) {
      throw new AppError('Player not found', 400);
    }

    if (!player.character_file) {
      throw new AppError('User does not have a character sheet saved', 400);
    }

    const playerSheetFilePath = path.join(
      uploadConfig('sheet').directory,
      player.character_file,
    );

    return playerSheetFilePath;
  }
}

export default GetUserCharacterSheet;
