import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Location from '@modules/locations/infra/typeorm/entities/Location';
import ILocationsRepository from '@modules/locations/repositories/ILocationsRepository';
import ICharactersRepository from '@modules/characters/repositories/ICharactersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequestDTO {
  user_id: string;
  location_id: string;
  name?: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  elysium?: boolean;
  type?: string;
  level?: number;
  mystical_level?: number;
  property?: string;
  clan?: string;
  creature_type?: string;
  sect?: string;
  char_id?: string | null;
}

@injectable()
class UpdateLocationService {
  constructor(
    @inject('LocationsRepository')
    private locationsRepository: ILocationsRepository,
    @inject('CharactersRepository')
    private charactersRepository: ICharactersRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    location_id,
    name,
    description,
    address,
    latitude,
    longitude,
    elysium,
    type,
    level,
    mystical_level,
    property,
    clan,
    creature_type,
    sect,
    char_id,
  }: IRequestDTO): Promise<Location> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated Storytellers can update locations',
        401,
      );
    } else if (!user.storyteller) {
      throw new AppError(
        'Only authenticated Storytellers can update locations',
        401,
      );
    }

    const location = await this.locationsRepository.findById(location_id);

    if (!location) {
      throw new AppError('Location not found', 400);
    }

    if (char_id) {
      const char = await this.charactersRepository.findById(char_id);

      if (!char) {
        throw new AppError('Character not found', 400);
      }

      location.responsible = char_id;
      delete location.responsible_char;
    } else if (char_id === null) {
      location.responsible = null;
      delete location.responsible_char;
    }

    if (name) location.name = name;
    if (description) location.description = description;
    if (address) location.address = address;
    if (latitude) location.latitude = latitude;
    if (longitude) location.longitude = longitude;
    if (elysium) location.elysium = elysium;
    if (type) location.type = type;
    if (level) location.level = level;
    if (mystical_level) location.mystical_level = mystical_level;
    if (property) location.property = property;
    if (clan) location.clan = clan;
    if (creature_type) location.creature_type = creature_type;
    if (sect) location.sect = sect;

    await this.locationsRepository.update(location);

    return location;
  }
}

export default UpdateLocationService;
