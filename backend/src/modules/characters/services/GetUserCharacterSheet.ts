import path from 'path';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import IUserRepository from '@modules/users/repositories/IUsersRepository';

interface IRequestDTO {
  user_id: string;
  player_id: string;
}

class GetUserCharacterSheet {
  constructor(private usersRepository: IUserRepository) {}

  public async execute({ user_id, player_id }: IRequestDTO): Promise<string> {
    const user = await this.usersRepository.findById(user_id);

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

    const player = await this.usersRepository.findById(player_id);

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
