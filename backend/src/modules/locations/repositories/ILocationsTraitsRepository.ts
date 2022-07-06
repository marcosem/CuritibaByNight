import LocationTrait from '@modules/locations/infra/typeorm/entities/LocationTrait';
import ICreateLocationTraitDTO from '@modules/locations/dtos/ICreateLocationTraitDTO';

export default interface ILocationsTraitsRepository {
  addTraitToLocation(data: ICreateLocationTraitDTO): Promise<LocationTrait>;
  updateTraitLocation(data: LocationTrait): Promise<LocationTrait>;
  findById(location_trait_id: string): Promise<LocationTrait | undefined>;
  findByLocationIdAndTraitId(
    location_id: string,
    trait_id: string,
  ): Promise<LocationTrait | undefined>;
  listTraitsByLocation(location_id: string): Promise<LocationTrait[]>;
  delete(location_trait_id: string): Promise<void>;
}
