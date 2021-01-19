import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import LocationCharacter from '@modules/locations/infra/typeorm/entities/LocationCharacter';
import ILocationsCharactersRepository from '@modules/locations/repositories/ILocationsCharactersRepository';
import ILocationsRepository from '@modules/locations/repositories/ILocationsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequestDTO {
  user_id: string;
  location_id: string;
}

@injectable()
class GetLocationCharactersListService {
  constructor(
    @inject('LocationsCharactersRepository')
    private locationsCharactersRepository: ILocationsCharactersRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('LocationsRepository')
    private locationsRepository: ILocationsRepository,
  ) {}

  public async execute({
    user_id,
    location_id,
  }: IRequestDTO): Promise<LocationCharacter[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated Storytellers can list all chracters from a locations',
        401,
      );
    } else if (!user.storyteller) {
      throw new AppError(
        'Only authenticated Storytellers can list all chracters from a locations',
        401,
      );
    }

    const location = await this.locationsRepository.findById(location_id);

    if (!location) {
      throw new AppError('Location not found', 400);
    }

    const charIdList = await this.locationsCharactersRepository.listCharactersByLocation(
      location_id,
    );

    return charIdList;
  }
}

export default GetLocationCharactersListService;
