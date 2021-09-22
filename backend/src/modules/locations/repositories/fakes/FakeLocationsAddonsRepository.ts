import LocationAddon from '@modules/locations/infra/typeorm/entities/LocationAddon';
import ICreateLocationAddonDTO from '@modules/locations/dtos/ICreateLocationAddonDTO';
import ILocationsAddonsRepository from '@modules/locations/repositories/ILocationsAddonsRepository';

import { v4 } from 'uuid';

class FakeLocationsAddonsRepository implements ILocationsAddonsRepository {
  private locationsAddons: LocationAddon[] = [];

  public async addAddonToLocation({
    location_id,
    addon_name,
    addon_level,
    addon_id_current,
    addon_id_next,
    temp_ability,
    temp_influence,
  }: ICreateLocationAddonDTO): Promise<LocationAddon> {
    const locAddon = new LocationAddon();

    Object.assign(locAddon, {
      id: v4(),
      location_id,
      addon_name,
      addon_level,
      addon_id_current,
      addon_id_next,
      temp_ability,
      temp_influence,
    });

    this.locationsAddons.push(locAddon);

    return locAddon;
  }

  public async updateAddonLocation(
    locAddon: LocationAddon,
  ): Promise<LocationAddon> {
    this.locationsAddons = this.locationsAddons.map(oldLocAddon =>
      oldLocAddon.id !== locAddon.id ? oldLocAddon : locAddon,
    );

    return locAddon;
  }

  public async findById(
    location_addon_id: string,
  ): Promise<LocationAddon | undefined> {
    const locAddonFound = this.locationsAddons.find(
      locAddon => locAddon.id === location_addon_id,
    );

    return locAddonFound;
  }

  public async findInLocationByAddonName(
    location_id: string,
    addon_name: string,
  ): Promise<LocationAddon | undefined> {
    const locAddonFound = this.locationsAddons.find(
      locAddon =>
        locAddon.location_id === location_id &&
        locAddon.addon_name === addon_name,
    );

    return locAddonFound;
  }

  public async listAddonsByLocation(
    location_id: string,
  ): Promise<LocationAddon[]> {
    const locAddons = this.locationsAddons.filter(
      locAddon => locAddon.location_id === location_id,
    );

    return locAddons;
  }

  public async delete(location_addon_id: string): Promise<void> {
    const listWithRemovedLocAddon = this.locationsAddons.filter(
      locAddon => locAddon.id !== location_addon_id,
    );

    this.locationsAddons = listWithRemovedLocAddon;
  }
}

export default FakeLocationsAddonsRepository;
