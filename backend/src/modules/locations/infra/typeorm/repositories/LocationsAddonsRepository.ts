import { getRepository, Repository } from 'typeorm';
import LocationAddon from '@modules/locations/infra/typeorm/entities/LocationAddon';
import ICreateLocationAddonDTO from '@modules/locations/dtos/ICreateLocationAddonDTO';
import ILocationsAddonsRepository from '@modules/locations/repositories/ILocationsAddonsRepository';

class LocationsAddonsRepository implements ILocationsAddonsRepository {
  private ormRepository: Repository<LocationAddon>;

  constructor() {
    this.ormRepository = getRepository(LocationAddon);
  }

  public async addAddonToLocation({
    location_id,
    addon_name,
    addon_level,
    addon_id_current,
    addon_id_next,
    temp_ability,
    temp_influence,
  }: ICreateLocationAddonDTO): Promise<LocationAddon> {
    const locAddon = this.ormRepository.create({
      location_id,
      addon_name,
      addon_level,
      addon_id_current,
      addon_id_next,
      temp_ability,
      temp_influence,
    });

    await this.ormRepository.save(locAddon);

    let savedLocAddon = await this.findById(locAddon.id);
    if (!savedLocAddon) {
      savedLocAddon = locAddon;
    }

    return savedLocAddon;
  }

  public async updateAddonLocation(
    locAddon: LocationAddon,
  ): Promise<LocationAddon> {
    await this.ormRepository.save(locAddon);

    let savedLocAddon = await this.findById(locAddon.id);
    if (!savedLocAddon) {
      savedLocAddon = locAddon;
    }

    return savedLocAddon;
  }

  public async findById(
    location_addon_id: string,
  ): Promise<LocationAddon | undefined> {
    const locAddonFound = await this.ormRepository.findOne({
      where: { id: location_addon_id },
    });

    // if not found, return undefined
    return locAddonFound;
  }

  public async findInLocationByAddonName(
    location_id: string,
    addon_name: string,
  ): Promise<LocationAddon | undefined> {
    const locAddonFound = await this.ormRepository.findOne({
      where: { location_id, addon_name },
    });

    // if not found, return undefined
    return locAddonFound;
  }

  public async listAddonsByLocation(
    location_id: string,
  ): Promise<LocationAddon[]> {
    const locAddons = await this.ormRepository.find({
      where: { location_id },
      order: { addon_name: 'ASC' },
    });

    return locAddons;
  }

  public async delete(location_addon_id: string): Promise<void> {
    const locAddon = await this.ormRepository.findOne({
      where: { id: location_addon_id },
    });

    if (locAddon) {
      await this.ormRepository.remove(locAddon);
    }
  }
}

export default LocationsAddonsRepository;
