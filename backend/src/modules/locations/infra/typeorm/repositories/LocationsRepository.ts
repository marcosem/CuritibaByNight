import { getRepository, Repository } from 'typeorm';
import Location from '@modules/locations/infra/typeorm/entities/Location';
import ICreateLocationDTO from '@modules/locations/dtos/ICreateLocationDTO';
import ILocationsRepository from '@modules/locations/repositories/ILocationsRepository';

class LocationsRepository implements ILocationsRepository {
  private ormRepository: Repository<Location>;

  constructor() {
    this.ormRepository = getRepository(Location);
  }

  public async create({
    name,
    description,
    address = '',
    latitude,
    longitude,
    elysium = false,
    type = 'other',
    level = 1,
    mystical_level = 0,
    property = 'private',
    clan,
    responsible,
  }: ICreateLocationDTO): Promise<Location> {
    const location = this.ormRepository.create({
      name,
      description,
      address,
      latitude,
      longitude,
      elysium,
      type,
      level,
      mystical_level,
      property,
      clan,
      responsible,
    });

    await this.ormRepository.save(location);

    // Return what is saved with character relationship attached.
    let savedLocation = await this.findById(location.id);
    if (!savedLocation) {
      savedLocation = location;
    }

    return savedLocation;
  }

  public async update(location: Location): Promise<Location> {
    await this.ormRepository.save(location);

    // Return what is saved with user relationship attached.
    let savedLocation = await this.findById(location.id);

    if (!savedLocation) {
      savedLocation = location;
    }

    return savedLocation;
  }

  public async findById(location_id: string): Promise<Location | undefined> {
    const locationFound = await this.ormRepository.findOne({
      where: { id: location_id },
      relations: ['responsible_char'],
    });

    // if not found, return undefined
    return locationFound;
  }

  public async findByCharacterId(
    char_id: string,
    char_clan: string,
  ): Promise<Location[]> {
    const where = [
      { responsible: char_id },
      { property: 'public' },
      { elysium: true },
      { clan: char_clan },
    ];

    const locationList = await this.ormRepository.find({
      where,
      relations: ['responsible_char'],
      order: { name: 'ASC' },
    });

    // if not found, return undefined
    return locationList;
  }

  public async listAll(): Promise<Location[]> {
    const locationList = await this.ormRepository.find({
      order: { name: 'ASC' },
      relations: ['responsible_char'],
    });

    return locationList;
  }

  public async delete(location_id: string): Promise<void> {
    const location = await this.ormRepository.findOne({
      where: { id: location_id },
    });

    if (location) {
      await this.ormRepository.remove(location);
    }
  }
}

export default LocationsRepository;
