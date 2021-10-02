import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Addon from '@modules/locations/infra/typeorm/entities/Addon';
import IAddonsRepository from '@modules/locations/repositories/IAddonsRepository';
import LocationAddon from '@modules/locations/infra/typeorm/entities/LocationAddon';
import ILocationsAddonsRepository from '@modules/locations/repositories/ILocationsAddonsRepository';
import ILocationsRepository from '@modules/locations/repositories/ILocationsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequestDTO {
  user_id: string;
  addon_name: string;
  addon_level?: number;
  location_id: string;
}

@injectable()
class AddAddonToLocationService {
  constructor(
    @inject('AddonsRepository')
    private addonsRepository: IAddonsRepository,
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
    addon_level = 0,
    location_id,
  }: IRequestDTO): Promise<LocationAddon> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated Storytellers can add an addon to a location',
        401,
      );
    } else if (!user.storyteller) {
      throw new AppError(
        'Only authenticated Storytellers can add an addon to a location',
        401,
      );
    }

    const location = await this.locationsRepository.findById(location_id);

    if (!location) {
      throw new AppError('Location not found', 400);
    }

    const warrens = location.name === 'Warrens Nosferatu';
    const nextLevel = addon_level + 1;
    let currentAddon: Addon | null;

    if (addon_level === 0) {
      currentAddon = null;
    } else {
      currentAddon =
        (await this.addonsRepository.findByNameLevel(
          addon_name,
          addon_level,
          warrens,
        )) || null;
    }

    const nextAddon =
      (await this.addonsRepository.findByNameLevel(
        addon_name,
        nextLevel,
        warrens,
      )) || null;

    if (currentAddon === null && nextAddon === null) {
      throw new AppError('Addon not found', 400);
    }

    const locationAddon = await this.locationsAddonsRepository.findInLocationByAddonName(
      location_id,
      addon_name,
    );

    if (locationAddon) {
      throw new AppError('Addon is already present in the location', 400);
    }

    const newLocationAddon = {
      location_id,
      addon_name,
      addon_level,
      addon_id_current: currentAddon !== null ? currentAddon.id : null,
      addon_id_next: nextAddon !== null ? nextAddon.id : null,
      temp_ability: 0,
      temp_influence: 0,
    };

    const locationAddonAdded = await this.locationsAddonsRepository.addAddonToLocation(
      newLocationAddon,
    );

    return locationAddonAdded;
  }
}

export default AddAddonToLocationService;
