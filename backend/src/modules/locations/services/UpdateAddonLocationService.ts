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
  temp_ability?: number;
  temp_influence?: number;
}

@injectable()
class UpdateAddonLocationService {
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
    addon_level,
    location_id,
    temp_ability,
    temp_influence,
  }: IRequestDTO): Promise<LocationAddon> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated Storytellers can update an addon of a location',
        401,
      );
    } else if (!user.storyteller) {
      throw new AppError(
        'Only authenticated Storytellers can update an addon of a location',
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
      throw new AppError('Addon-Location not found', 400);
    }

    // data from DB comes as string, need to ensure it is integer for comparision
    const locationAddonLevel: number = parseInt(
      `${locationAddon.addon_level}`,
      10,
    );

    const addonLevel =
      addon_level === undefined ? locationAddonLevel : addon_level;

    let nextAddon: Addon | null;

    if (addonLevel !== locationAddonLevel) {
      const warrens = location.name === 'Warrens Nosferatu';
      const nextLevel = addonLevel + 1;
      let currentAddon: Addon | null;

      if (addonLevel === 0) {
        currentAddon = null;
      } else {
        currentAddon =
          (await this.addonsRepository.findByNameLevel(
            addon_name,
            addonLevel,
            warrens,
          )) || null;
      }

      nextAddon =
        (await this.addonsRepository.findByNameLevel(
          addon_name,
          nextLevel,
          warrens,
        )) || null;

      if (currentAddon === null && nextAddon === null) {
        throw new AppError('Addon not found', 400);
      }

      locationAddon.addon_level = addonLevel;
      locationAddon.addon_id_current =
        currentAddon !== null ? currentAddon.id : null;
      locationAddon.addon_id_next = nextAddon !== null ? nextAddon.id : null;
      locationAddon.temp_ability = 0;
      locationAddon.temp_influence = 0;

      delete locationAddon.currentAddon;
      delete locationAddon.nextAddon;
    } else {
      let tempAbility: number;
      let tempInfluence: number;

      if (locationAddon.addon_id_next !== null) {
        nextAddon =
          (await this.addonsRepository.findById(locationAddon.addon_id_next)) ||
          null;

        if (nextAddon === null) {
          locationAddon.addon_id_next = null;
          delete locationAddon.nextAddon;
        }
      } else {
        nextAddon = null;
      }

      if (nextAddon === null) {
        tempAbility = 0;
        tempInfluence = 0;
      } else {
        if (temp_ability !== undefined) {
          tempAbility =
            temp_ability > nextAddon.ability_qty
              ? nextAddon.ability_qty
              : temp_ability;
        } else {
          tempAbility = locationAddon.temp_ability;
        }

        if (temp_influence !== undefined) {
          tempInfluence =
            temp_influence > nextAddon.influence_qty
              ? nextAddon.influence_qty
              : temp_influence;
        } else {
          tempInfluence = locationAddon.temp_influence;
        }
      }

      locationAddon.temp_ability = tempAbility;
      locationAddon.temp_influence = tempInfluence;
    }

    const updatedLocationAddon = await this.locationsAddonsRepository.updateAddonLocation(
      locationAddon,
    );

    return updatedLocationAddon;
  }
}

export default UpdateAddonLocationService;
