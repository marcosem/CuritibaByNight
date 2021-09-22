import LocationAddon from '@modules/locations/infra/typeorm/entities/LocationAddon';
import ICreateLocationAddonDTO from '@modules/locations/dtos/ICreateLocationAddonDTO';

export default interface ILocationsAddonsRepository {
  addAddonToLocation(data: ICreateLocationAddonDTO): Promise<LocationAddon>;
  updateAddonLocation(data: LocationAddon): Promise<LocationAddon>;
  findById(location_addon_id: string): Promise<LocationAddon | undefined>;
  findInLocationByAddonName(
    location_id: string,
    addon_name: string,
  ): Promise<LocationAddon | undefined>;
  listAddonsByLocation(location_id: string): Promise<LocationAddon[]>;
  delete(location_addon_id: string): Promise<void>;
}
