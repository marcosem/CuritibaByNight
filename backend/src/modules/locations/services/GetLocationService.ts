import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Location from '@modules/locations/infra/typeorm/entities/Location';
import ILocationsRepository from '@modules/locations/repositories/ILocationsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICharactersRepository from '@modules/characters/repositories/ICharactersRepository';
import ILocationsCharactersRepository from '@modules/locations/repositories/ILocationsCharactersRepository';

interface IRequestDTO {
  user_id: string;
  char_id?: string;
  location_id: string;
}

@injectable()
class GetLocationService {
  constructor(
    @inject('LocationsRepository')
    private locationsRepository: ILocationsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('CharactersRepository')
    private charactersRepository: ICharactersRepository,
    @inject('LocationsCharactersRepository')
    private locationsCharactersRepository: ILocationsCharactersRepository,
  ) {}

  public async execute({
    user_id,
    char_id,
    location_id,
  }: IRequestDTO): Promise<Location> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated user can load locations', 401);
    } else if (!user.storyteller && !char_id) {
      throw new AppError(
        'Only authenticated Storytellers can locations without identify a character',
        401,
      );
    }

    const location = await this.locationsRepository.findById(location_id);

    if (!location) {
      throw new AppError('Location not found', 400);
    }

    // if (location.property === 'public' || location.elysium === true) {
    if (location.property === 'public') {
      return location;
    }

    if (char_id) {
      const char = await this.charactersRepository.findById(char_id);

      if (!char) {
        throw new AppError('Character not found', 400);
      }

      const locationChar = await this.locationsCharactersRepository.find(
        char_id,
        location_id,
      );

      const isShared = locationChar ? locationChar.shared : false;

      if (
        (location.responsible !== char_id &&
          location.clan !== char.clan &&
          (location.creature_type === undefined ||
            location.creature_type !== char.creature_type) &&
          (location.sect === undefined || location.sect !== char.sect)) ||
        !isShared
      ) {
        throw new AppError(
          'This character does not have permission to load this location',
          401,
        );
      }
    }

    return location;
  }
}

export default GetLocationService;
