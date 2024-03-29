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
  char_traits: CharacterTrait[];
}

@injectable()
class AddCharacterTraitsService {
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
    char_traits,
  }: IRequestDTO): Promise<CharacterTrait[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated Storytellers can add character traits',
        401,
      );
    } else if (!user.storyteller) {
      throw new AppError(
        'Only authenticated Storytellers can add character traits',
        401,
      );
    }

    const char = await this.charactersRepository.findById(char_id);

    if (!char) {
      throw new AppError('Character not found', 400);
    }

    if (char_traits.length === 0) {
      throw new AppError('No characters traits to be added', 400);
    }

    // Remove routes results when adding new traits
    this.saveRouteResult.remove('CharactersInfluences');
    this.saveRouteResult.remove('PowersList');

    // Save Personal Masquerade if exist
    const masqueradeTrait = await this.charactersTraitsRepository.findTraitByCharId(
      char_id,
      'Personal Masquerade',
      'creature',
    );

    // Delete all from Character Id
    await this.charactersTraitsRepository.deleteAllByChar(char_id);

    if (masqueradeTrait) {
      char_traits.push(masqueradeTrait);
    } else {
      const masqTrait = {
        trait: 'Personal Masquerade',
        character_id: char_id,
        level: 10,
        level_temp:
          'empty|empty|empty|empty|empty|empty|empty|empty|empty|empty',
        type: 'creature',
      } as CharacterTrait;

      char_traits.push(masqTrait);
    }

    const charTraits = char_traits.map(charTrait => {
      const newTrait = {
        trait: charTrait.trait,
        character_id: char_id,
        level: charTrait.level,
        level_temp: charTrait.level_temp,
        type: charTrait.type,
      };

      return newTrait;
    });

    const savedCharTraits = await this.charactersTraitsRepository.createList(
      charTraits,
    );

    return savedCharTraits;
  }
}

export default AddCharacterTraitsService;
