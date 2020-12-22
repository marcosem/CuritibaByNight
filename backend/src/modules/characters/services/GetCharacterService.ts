import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICharactersRepository from '@modules/characters/repositories/ICharactersRepository';
import Character from '@modules/characters/infra/typeorm/entities/Character';

interface IRequestDTO {
  user_id: string;
  char_id: string;
}

@injectable()
class GetCharacterService {
  constructor(
    @inject('CharactersRepository')
    private charactersRepository: ICharactersRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id, char_id }: IRequestDTO): Promise<Character> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated users can load his characters sheets',
        401,
      );
    }

    const char = await this.charactersRepository.findById(char_id);

    if (!char) {
      throw new AppError('Character not found', 400);
    }

    if (!user.storyteller && user_id !== char.user_id) {
      throw new AppError(
        'Only authenticated Storytellers can get other players character sheets',
        401,
      );
    }

    return char;
  }
}

export default GetCharacterService;
