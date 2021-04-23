import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import CharacterTrait from '@modules/characters/infra/typeorm/entities/CharacterTrait';
import ICharactersTraitsRepository from '@modules/characters/repositories/ICharactersTraitsRepository';
import ICharactersRepository from '@modules/characters/repositories/ICharactersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequestDTO {
  user_id: string;
  char_id: string;
}

@injectable()
class GetCharacterTraitsService {
  constructor(
    @inject('CharactersTraitsRepository')
    private charactersTraitsRepository: ICharactersTraitsRepository,
    @inject('CharactersRepository')
    private charactersRepository: ICharactersRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    char_id,
  }: IRequestDTO): Promise<CharacterTrait[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can get traits list', 401);
    }

    const char = await this.charactersRepository.findById(char_id);

    if (!char) {
      throw new AppError('Character not found', 400);
    }

    if (!user.storyteller && user_id !== char.user_id) {
      throw new AppError(
        'Only authenticated Storytellers can get other players traits list',
        401,
      );
    }

    const traitsList = await this.charactersTraitsRepository.findByCharId(
      char.id,
      'all',
    );

    return traitsList;
  }
}

export default GetCharacterTraitsService;
