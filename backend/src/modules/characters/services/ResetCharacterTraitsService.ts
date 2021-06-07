import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import ICharactersTraitsRepository from '@modules/characters/repositories/ICharactersTraitsRepository';
import ICharactersRepository from '@modules/characters/repositories/ICharactersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ISaveRouteResultProvider from '@shared/container/providers/SaveRouteResultProvider/models/ISaveRouteResultProvider';

interface IRequestDTO {
  user_id: string;
  char_id: string;
  keep_masquerade: boolean;
}

@injectable()
class ResetCharacterTraitsService {
  constructor(
    @inject('CharactersTraitsRepository')
    private charactersTraitsRepository: ICharactersTraitsRepository,
    @inject('CharactersRepository')
    private charactersRepository: ICharactersRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('SaveRouteResultProvider')
    private saveRouteResult: ISaveRouteResultProvider,
  ) {}

  public async execute({
    user_id,
    char_id,
    keep_masquerade,
  }: IRequestDTO): Promise<void> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated Storytellers can update character traits',
        401,
      );
    } else if (!user.storyteller) {
      throw new AppError(
        'Only authenticated Storytellers can update character traits',
        401,
      );
    }

    const char = await this.charactersRepository.findById(char_id);

    if (!char) {
      throw new AppError('Character not found', 400);
    }

    // Remove route result when reset a character traits
    this.saveRouteResult.remove('CharactersInfluences');

    await this.charactersTraitsRepository.resetTraitsLevel(
      char_id,
      keep_masquerade,
    );
  }
}

export default ResetCharacterTraitsService;
