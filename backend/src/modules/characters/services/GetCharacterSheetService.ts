import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICharactersRepository from '@modules/characters/repositories/ICharactersRepository';
// import Character from '@modules/characters/infra/typeorm/entities/Character';
import uploadConfig from '@config/upload';
import path from 'path';

interface IRequestDTO {
  user_id: string;
  char_id: string;
}

@injectable()
class GetCharacterSheet {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('CharactersRepository')
    private charactersRepository: ICharactersRepository,
  ) {}

  public async execute({ user_id, char_id }: IRequestDTO): Promise<string> {
    const char = await this.charactersRepository.findById(char_id);

    if (!char) {
      throw new AppError('Character not found', 400);
    }

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated users can load his characters sheets',
        401,
      );
    } else if (!user.storyteller && user_id !== char.user_id) {
      throw new AppError(
        'Only authenticated Storytellers can get other players character sheets',
        401,
      );
    }

    const playerSheetFilePath = path.join(
      uploadConfig('sheet').uploadsFolder,
      char.file,
    );

    return playerSheetFilePath;
  }
}

export default GetCharacterSheet;
