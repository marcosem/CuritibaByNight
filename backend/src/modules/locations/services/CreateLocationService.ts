import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Location from '@modules/locations/infra/typeorm/entities/Location';
import ILocationsRepository from '@modules/locations/repositories/ILocationsRepository';
import ICharactersRepository from '@modules/characters/repositories/ICharactersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequestDTO {
  user_id: string;
  name: string;
  description: string;
  address?: string;
  latitude: number;
  longitude: number;
  elysium?: boolean;
  type?: string;
  level?: number;
  property?: string;
  clan?: string;
  char_id?: string;
}

@injectable()
class CreateLocationService {
  constructor(
    @inject('LocationsRepository')
    private locationsRepository: ILocationsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('CharactersRepository')
    private charactersRepository: ICharactersRepository,
  ) {}

  public async execute({
    user_id,
    name,
    description,
    address,
    latitude,
    longitude,
    elysium,
    type,
    level,
    property,
    clan,
    char_id,
  }: IRequestDTO): Promise<Location> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated Storytellers can add locations',
        401,
      );
    } else if (!user.storyteller) {
      throw new AppError(
        'Only authenticated Storytellers can add locations',
        401,
      );
    }

    if (char_id) {
      const char = await this.charactersRepository.findById(char_id);

      if (!char) {
        throw new AppError('Character not found', 400);
      }
    }

    const location = await this.locationsRepository.create({
      name,
      description,
      address,
      latitude,
      longitude,
      elysium,
      type,
      level,
      property,
      clan,
      responsible: char_id,
    });

    return location;
  }
}

export default CreateLocationService;
