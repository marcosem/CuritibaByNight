import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Location from '@modules/locations/infra/typeorm/entities/Location';
import ILocationsRepository from '@modules/locations/repositories/ILocationsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICharactersRepository from '@modules/characters/repositories/ICharactersRepository';

interface IRequestDTO {
  user_id: string;
  char_id?: string;
}

@injectable()
class GetLocationsListService {
  constructor(
    @inject('LocationsRepository')
    private locationsRepository: ILocationsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('CharactersRepository')
    private charactersRepository: ICharactersRepository,
  ) {}

  public async execute({ user_id, char_id }: IRequestDTO): Promise<Location[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated user can get locations list', 401);
    } else if (!user.storyteller && !char_id) {
      throw new AppError(
        'Only authenticated Storytellers can get locations list without identify a character',
        401,
      );
    }

    let locationList: Location[];

    if (!char_id) {
      locationList = await this.locationsRepository.listAll();
    } else {
      const char = await this.charactersRepository.findById(char_id);

      if (!char) {
        throw new AppError('Character not found', 400);
      }

      locationList = await this.locationsRepository.findByCharacterId(
        char_id,
        char.clan,
      );
    }

    return locationList;
  }
}

export default GetLocationsListService;
