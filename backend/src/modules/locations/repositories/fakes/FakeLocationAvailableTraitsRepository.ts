import LocationAvailableTrait from '@modules/locations/infra/typeorm/entities/LocationAvailableTrait';
import ICreateLocationAvailableTraitDTO from '@modules/locations/dtos/ICreateLocationAvailableTraitDTO';
import ILocationAvailableTraitsRepository from '@modules/locations/repositories/ILocationAvailableTraitsRepository';

import { v4 } from 'uuid';

class FakeLocationAvailableTraitsRepository
  implements ILocationAvailableTraitsRepository {
  private locationAvailableTraits: LocationAvailableTrait[] = [];

  public async createList(
    dataList: ICreateLocationAvailableTraitDTO[],
  ): Promise<LocationAvailableTrait[]> {
    const locAvaiTraitsList = dataList.map(data => {
      const locAvaiTrait = new LocationAvailableTrait();

      Object.assign(locAvaiTrait, {
        id: v4(),
        trait: data.trait,
        type: data.type,
      });

      return locAvaiTrait;
    });

    this.locationAvailableTraits = this.locationAvailableTraits.concat(
      locAvaiTraitsList,
    );

    return locAvaiTraitsList;
  }

  public async create({
    trait,
    type,
  }: ICreateLocationAvailableTraitDTO): Promise<LocationAvailableTrait> {
    const locAvaiTrait = new LocationAvailableTrait();

    Object.assign(locAvaiTrait, {
      id: v4(),
      trait,
      type,
    });

    this.locationAvailableTraits.push(locAvaiTrait);

    return locAvaiTrait;
  }

  public async updateLocationAvailableTrait(
    locAvaiTrait: LocationAvailableTrait,
  ): Promise<LocationAvailableTrait> {
    this.locationAvailableTraits = this.locationAvailableTraits.map(
      oldLocaAvaiTrait =>
        oldLocaAvaiTrait.id !== locAvaiTrait.id
          ? oldLocaAvaiTrait
          : locAvaiTrait,
    );

    return locAvaiTrait;
  }

  public async findById(
    location_available_trait_id: string,
  ): Promise<LocationAvailableTrait | undefined> {
    const locAvaiTraitFound = this.locationAvailableTraits.find(
      locAvaiTrait => locAvaiTrait.id === location_available_trait_id,
    );

    return locAvaiTraitFound;
  }

  public async findLocationAvailableTraitByNameType(
    trait: string,
    type: string,
  ): Promise<LocationAvailableTrait | undefined> {
    const locAvaiTraitFound = this.locationAvailableTraits.find(
      locAvaiTrait =>
        locAvaiTrait.trait === trait && locAvaiTrait.type === type,
    );

    return locAvaiTraitFound;
  }

  public async listAll(): Promise<LocationAvailableTrait[]> {
    return this.locationAvailableTraits;
  }

  public async listLocationAvailableTraitsByType(
    type?: string,
  ): Promise<LocationAvailableTrait[]> {
    let locAvaiTraits: LocationAvailableTrait[];

    if (type) {
      locAvaiTraits = this.locationAvailableTraits.filter(
        locAvaiTrait => locAvaiTrait.type === type,
      );
    } else {
      locAvaiTraits = await this.listAll();
    }

    return locAvaiTraits;
  }

  public async delete(location_available_trait_id: string): Promise<void> {
    const listWithRemovedLocAvaiTrait = this.locationAvailableTraits.filter(
      locAvaiTrait => locAvaiTrait.id !== location_available_trait_id,
    );

    this.locationAvailableTraits = listWithRemovedLocAvaiTrait;
  }
}

export default FakeLocationAvailableTraitsRepository;
