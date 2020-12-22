import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import LocationCharacter from '@modules/locations/infra/typeorm/entities/LocationCharacter';
import ILocationsCharactersRepository from '@modules/locations/repositories/ILocationsCharactersRepository';
import ILocationsRepository from '@modules/locations/repositories/ILocationsRepository';
import ICharactersRepository from '@modules/characters/repositories/ICharactersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequestDTO {
  user_id: string;
  char_id: string;
  location_id: string;
}

@injectable()
class GetCharacterLocationService {
  constructor(
    @inject('LocationsCharactersRepository')
    private locationsCharactersRepository: ILocationsCharactersRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('LocationsRepository')
    private locationsRepository: ILocationsRepository,
    @inject('CharactersRepository')
    private charactersRepository: ICharactersRepository,
  ) {}

  public async execute({
    user_id,
    char_id,
    location_id,
  }: IRequestDTO): Promise<LocationCharacter> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated users can get a character-location',
        401,
      );
    }

    const char = await this.charactersRepository.findById(char_id);

    if (!char) {
      throw new AppError('Character not found', 400);
    }

    const location = await this.locationsRepository.findById(location_id);

    if (!location) {
      throw new AppError('Location not found', 400);
    }

    const locChar = await this.locationsCharactersRepository.find(
      char_id,
      location_id,
    );

    if (!user.storyteller && char.user_id !== user_id) {
      throw new AppError(
        'Only authenticated Storytellers can get character-location for others chracters',
        401,
      );
    }

    if (!locChar) {
      throw new AppError('Character-location not found', 400);
    }

    return locChar;
  }
}

export default GetCharacterLocationService;
