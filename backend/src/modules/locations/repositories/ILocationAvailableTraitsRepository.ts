import LocationAvailableTrait from '@modules/locations/infra/typeorm/entities/LocationAvailableTrait';
import ICreateLocationAvailableTraitDTO from '@modules/locations/dtos/ICreateLocationAvailableTraitDTO';

export default interface ILocationAvailableTraitsRepository {
  createList(
    dataList: ICreateLocationAvailableTraitDTO[],
  ): Promise<LocationAvailableTrait[]>;
  create(
    data: ICreateLocationAvailableTraitDTO,
  ): Promise<LocationAvailableTrait>;
  updateLocationAvailableTrait(
    data: LocationAvailableTrait,
  ): Promise<LocationAvailableTrait>;
  findById(
    location_available_trait_id: string,
  ): Promise<LocationAvailableTrait | undefined>;
  findLocationAvailableTraitByNameType(
    trait: string,
    type: string,
  ): Promise<LocationAvailableTrait | undefined>;
  listAll(): Promise<LocationAvailableTrait[]>;
  listLocationAvailableTraitsByType(
    type?: string,
  ): Promise<LocationAvailableTrait[]>;
  delete(location_available_trait_id: string): Promise<void>;
}
