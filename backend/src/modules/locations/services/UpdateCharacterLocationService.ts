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
  shared: boolean;
}

@injectable()
class UpdateCharacterLocationService {
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
    shared,
  }: IRequestDTO): Promise<LocationCharacter> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated Storytellers can add a character to a location',
        401,
      );
    } else if (!user.storyteller) {
      throw new AppError(
        'Only authenticated Storytellers can add a character to a location',
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

    if (!locChar) {
      throw new AppError('Character-Location not found', 400);
    }

    if (
      !shared &&
      (location.property === 'public' ||
        (location.clan !== null && location.clan === char.clan) ||
        (location.creature_type !== null &&
          location.creature_type === char.creature_type) ||
        (location.sect !== null && location.sect === char.sect))
    ) {
      await this.locationsCharactersRepository.delete(char_id, location_id);
      throw new AppError(
        'The character was removed from Location, he is only aware of it now',
        200,
      );
    }

    const locationCharacter = await this.locationsCharactersRepository.updateCharLocation(
      char_id,
      location_id,
      shared,
    );

    return locationCharacter;
  }
}

export default UpdateCharacterLocationService;
