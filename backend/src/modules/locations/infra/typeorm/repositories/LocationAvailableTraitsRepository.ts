import { getRepository, Repository } from 'typeorm';
import LocationAvailableTrait from '@modules/locations/infra/typeorm/entities/LocationAvailableTrait';
import ICreateLocationAvailableTraitDTO from '@modules/locations/dtos/ICreateLocationAvailableTraitDTO';
import ILocationAvailableTraitsRepository from '@modules/locations/repositories/ILocationAvailableTraitsRepository';

class LocationAvailableTraitsRepository
  implements ILocationAvailableTraitsRepository {
  private ormRepository: Repository<LocationAvailableTrait>;

  constructor() {
    this.ormRepository = getRepository(LocationAvailableTrait);
  }

  public async createList(
    dataList: ICreateLocationAvailableTraitDTO[],
  ): Promise<LocationAvailableTrait[]> {
    const locAvaiTraitsList = this.ormRepository.create(dataList);
    await this.ormRepository.save(locAvaiTraitsList);

    return locAvaiTraitsList;
  }

  public async create({
    trait,
    type,
  }: ICreateLocationAvailableTraitDTO): Promise<LocationAvailableTrait> {
    const locAvaiTrait = this.ormRepository.create({
      trait,
      type,
    });

    await this.ormRepository.save(locAvaiTrait);

    let savedLocAvaiTrait = await this.findById(locAvaiTrait.id);
    if (!savedLocAvaiTrait) {
      savedLocAvaiTrait = locAvaiTrait;
    }

    return savedLocAvaiTrait;
  }

  public async updateLocationAvailableTrait(
    locAvaiTrait: LocationAvailableTrait,
  ): Promise<LocationAvailableTrait> {
    await this.ormRepository.save(locAvaiTrait);

    let savedLocAvaiTrait = await this.findById(locAvaiTrait.id);
    if (!savedLocAvaiTrait) {
      savedLocAvaiTrait = locAvaiTrait;
    }

    return savedLocAvaiTrait;
  }

  public async findById(
    location_available_trait_id: string,
  ): Promise<LocationAvailableTrait | undefined> {
    const locAvaiTrait = await this.ormRepository.findOne({
      where: { id: location_available_trait_id },
    });

    // if not found, return undefined
    return locAvaiTrait;
  }

  public async findLocationAvailableTraitByNameType(
    trait: string,
    type: string,
  ): Promise<LocationAvailableTrait | undefined> {
    const locAvaiTrait = await this.ormRepository.findOne({
      where: { trait, type },
    });

    // if not found, return undefined
    return locAvaiTrait;
  }

  public async listAll(): Promise<LocationAvailableTrait[]> {
    const locAvaiTraits = await this.ormRepository.find({
      order: { trait: 'ASC' },
    });

    return locAvaiTraits;
  }

  public async listLocationAvailableTraitsByType(
    type?: string,
  ): Promise<LocationAvailableTrait[]> {
    let locAvaiTraits: LocationAvailableTrait[];

    if (type) {
      locAvaiTraits = await this.ormRepository.find({
        where: { type },
        order: { trait: 'ASC' },
      });
    } else {
      locAvaiTraits = await this.listAll();
    }

    return locAvaiTraits;
  }

  public async delete(location_available_trait_id: string): Promise<void> {
    const locAvaiTrait = await this.ormRepository.findOne({
      where: { id: location_available_trait_id },
    });

    if (locAvaiTrait) {
      await this.ormRepository.remove(locAvaiTrait);
    }
  }
}

export default LocationAvailableTraitsRepository;
