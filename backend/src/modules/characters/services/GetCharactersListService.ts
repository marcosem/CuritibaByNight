import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICharactersRepository from '@modules/characters/repositories/ICharactersRepository';
import Character from '@modules/characters/infra/typeorm/entities/Character';

interface IRequestDTO {
  user_id: string;
}

@injectable()
class GetUserCharacterSheet {
  constructor(
    @inject('CharactersRepository')
    private charactersRepository: ICharactersRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id }: IRequestDTO): Promise<Character[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated Storytellers can get characters list',
        401,
      );
    } else if (!user.storyteller) {
      throw new AppError(
        'Only authenticated Storytellers can get characters list',
        401,
      );
    }

    const charList = await this.charactersRepository.listAll();

    return charList;
  }
}

export default GetUserCharacterSheet;
