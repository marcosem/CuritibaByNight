import LocationTrait from '@modules/locations/infra/typeorm/entities/LocationTrait';
import ICreateLocationTraitDTO from '@modules/locations/dtos/ICreateLocationTraitDTO';
import ILocationsTraitsRepository from '@modules/locations/repositories/ILocationsTraitsRepository';

import { v4 } from 'uuid';

class FakeLocationsTraitsRepository implements ILocationsTraitsRepository {
  private locationsTraits: LocationTrait[] = [];

  public async addTraitToLocation({
    location_id,
    trait_id,
    level,
  }: ICreateLocationTraitDTO): Promise<LocationTrait> {
    const locTrait = new LocationTrait();

    Object.assign(locTrait, {
      id: v4(),
      location_id,
      trait_id,
      level,
    });

    this.locationsTraits.push(locTrait);

    return locTrait;
  }

  public async updateTraitLocation(
    locTrait: LocationTrait,
  ): Promise<LocationTrait> {
    this.locationsTraits = this.locationsTraits.map(oldLocTrait =>
      oldLocTrait.id !== locTrait.id ? oldLocTrait : locTrait,
    );

    return locTrait;
  }

  public async findById(
    location_trait_id: string,
  ): Promise<LocationTrait | undefined> {
    const locTraitFound = this.locationsTraits.find(
      locTrait => locTrait.id === location_trait_id,
    );

    return locTraitFound;
  }

  public async findByLocationIdAndTraitId(
    location_id: string,
    trait_id: string,
  ): Promise<LocationTrait | undefined> {
    const locTraitFound = this.locationsTraits.find(
      locTrait =>
        locTrait.location_id === location_id && locTrait.trait_id === trait_id,
    );

    return locTraitFound;
  }

  public async listTraitsByLocation(
    location_id: string,
  ): Promise<LocationTrait[]> {
    const locTraits = this.locationsTraits.filter(
      locTrait => locTrait.location_id === location_id,
    );

    return locTraits;
  }

  public async delete(location_trait_id: string): Promise<void> {
    const listWithRemovedLocTrait = this.locationsTraits.filter(
      locTrait => locTrait.id !== location_trait_id,
    );

    this.locationsTraits = listWithRemovedLocTrait;
  }
}

export default FakeLocationsTraitsRepository;
