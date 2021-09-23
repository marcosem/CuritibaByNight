import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Addon from '@modules/locations/infra/typeorm/entities/Addon';
import IAddonsRepository from '@modules/locations/repositories/IAddonsRepository';
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
class GetAvailableAddonsListService {
  constructor(
    @inject('AddonsRepository')
    private addonsRepository: IAddonsRepository,
    @inject('LocationsRepository')
    private locationsRepository: ILocationsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('CharacterRepository')
    private charactersRepository: ICharactersRepository,
    @inject('LocationsCharactersRepository')
    private locationsCharactersRepository: ILocationsCharactersRepository,
  ) {}

  public async execute({
    user_id,
    char_id,
    location_id,
  }: IRequestDTO): Promise<Addon[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated user can get addons list', 401);
    } else if (!user.storyteller && !char_id) {
      throw new AppError(
        'Only authenticated Storytellers can get addons without identify a character',
        401,
      );
    }

    const location = await this.locationsRepository.findById(location_id);

    if (!location) {
      throw new AppError('Location not found', 400);
    }

    const warrens = location.name === 'Warrens Nosferatu';
    if (char_id) {
      const char = await this.charactersRepository.findById(char_id);

      if (!char) {
        throw new AppError('Character not found', 400);
      }

      if (
        !(location.property === 'clan' && location.clan === char.clan) &&
        location.responsible !== char_id
      ) {
        const locChar = await this.locationsCharactersRepository.find(
          char_id,
          location_id,
        );

        if (locChar !== undefined && locChar.shared === false) {
          throw new AppError(
            'The character does not have access to this location',
            401,
          );
        }
      }
    }

    const addonsList = await this.addonsRepository.listAll(false, warrens);

    return addonsList;
  }
}

export default GetAvailableAddonsListService;
