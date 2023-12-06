import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import CharacterTrait from '@modules/characters/infra/typeorm/entities/CharacterTrait';
import ICharactersTraitsRepository from '@modules/characters/repositories/ICharactersTraitsRepository';
import ICharactersRepository from '@modules/characters/repositories/ICharactersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ISaveRouteResultProvider from '@shared/container/providers/SaveRouteResultProvider/models/ISaveRouteResultProvider';

interface IRequestDTO {
  user_id: string;
  char_id: string;
  trait_id: string;
  trait_name: string;
  trait_type: string;
  trait_level: number;
  trait_level_temp?: string;
}

@injectable()
class UpdateCharacterTraitService {
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
    trait_id,
    trait_name,
    trait_type,
    trait_level,
    trait_level_temp,
  }: IRequestDTO): Promise<CharacterTrait> {
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

    const trait = await this.charactersTraitsRepository.findById(trait_id);

    if (!trait) {
      throw new AppError('Character Trait not found', 400);
    }

    // Remove route result when changed any trait
    this.saveRouteResult.remove('CharactersInfluences');
    this.saveRouteResult.remove('PowersList');

    trait.trait = trait_name;
    trait.type = trait_type;
    trait.level = trait_level;
    trait.level_temp = trait_level_temp;

    const savedTrait = await this.charactersTraitsRepository.update(trait);

    return savedTrait;
  }
}

export default UpdateCharacterTraitService;
