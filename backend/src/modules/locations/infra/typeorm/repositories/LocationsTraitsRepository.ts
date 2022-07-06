import { getRepository, Repository } from 'typeorm';
import LocationTrait from '@modules/locations/infra/typeorm/entities/LocationTrait';
import ICreateLocationTraitDTO from '@modules/locations/dtos/ICreateLocationTraitDTO';
import ILocationsTraitsRepository from '@modules/locations/repositories/ILocationsTraitsRepository';

class LocationsTraitsRepository implements ILocationsTraitsRepository {
  private ormRepository: Repository<LocationTrait>;

  constructor() {
    this.ormRepository = getRepository(LocationTrait);
  }

  public async addTraitToLocation({
    location_id,
    trait_id,
    level,
  }: ICreateLocationTraitDTO): Promise<LocationTrait> {
    const locTrait = this.ormRepository.create({
      location_id,
      trait_id,
      level,
    });

    await this.ormRepository.save(locTrait);

    let savedLocTrait = await this.findById(locTrait.id);
    if (!savedLocTrait) {
      savedLocTrait = locTrait;
    }

    return savedLocTrait;
  }

  public async updateTraitLocation(
    locTrait: LocationTrait,
  ): Promise<LocationTrait> {
    await this.ormRepository.save(locTrait);

    let savedLocTrait = await this.findById(locTrait.id);
    if (!savedLocTrait) {
      savedLocTrait = locTrait;
    }

    return savedLocTrait;
  }

  public async findById(
    location_trait_id: string,
  ): Promise<LocationTrait | undefined> {
    const locTraitFound = await this.ormRepository.findOne({
      where: { id: location_trait_id },
      relations: ['locationId', 'traitId'],
    });

    // if not found, return undefined
    return locTraitFound;
  }

  public async findByLocationIdAndTraitId(
    location_id: string,
    trait_id: string,
  ): Promise<LocationTrait | undefined> {
    const locTraitFound = await this.ormRepository.findOne({
      where: { location_id, trait_id },
      relations: ['locationId', 'traitId'],
    });

    // if not found, return undefined
    return locTraitFound;
  }

  public async listTraitsByLocation(
    location_id: string,
  ): Promise<LocationTrait[]> {
    const locTraits = await this.ormRepository.find({
      where: { location_id },
      relations: ['locationId', 'traitId'],
    });

    return locTraits;
  }

  public async delete(location_trait_id: string): Promise<void> {
    const locTrait = await this.ormRepository.findOne({
      where: { id: location_trait_id },
    });

    if (locTrait) {
      await this.ormRepository.remove(locTrait);
    }
  }
}

export default LocationsTraitsRepository;
