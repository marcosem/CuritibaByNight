import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import ILocationsAddonsRepository from '@modules/locations/repositories/ILocationsAddonsRepository';
import ILocationsRepository from '@modules/locations/repositories/ILocationsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequestDTO {
  user_id: string;
  addon_name: string;
  location_id: string;
}

@injectable()
class RemoveAddonFromLocationService {
  constructor(
    @inject('LocationsAddonsRepository')
    private locationsAddonsRepository: ILocationsAddonsRepository,
    @inject('LocationsRepository')
    private locationsRepository: ILocationsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    addon_name,
    location_id,
  }: IRequestDTO): Promise<void> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated Storytellers can remove an addon from a location',
        401,
      );
    } else if (!user.storyteller) {
      throw new AppError(
        'Only authenticated Storytellers can remove an addon from a location',
        401,
      );
    }

    const location = await this.locationsRepository.findById(location_id);

    if (!location) {
      throw new AppError('Location not found', 400);
    }

    const locationAddon = await this.locationsAddonsRepository.findInLocationByAddonName(
      location_id,
      addon_name,
    );

    if (!locationAddon) {
      throw new AppError('The location does not have this addon', 400);
    }

    await this.locationsAddonsRepository.delete(locationAddon.id);
  }
}

export default RemoveAddonFromLocationService;
