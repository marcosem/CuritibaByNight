import Location from '@modules/locations/infra/typeorm/entities/Location';
import ICreateLocationDTO from '@modules/locations/dtos/ICreateLocationDTO';
import ILocationsRepository from '@modules/locations/repositories/ILocationsRepository';

import { v4 } from 'uuid';

class FakeLocationsRepository implements ILocationsRepository {
  private locations: Location[] = [];

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
    creature_type,
    sect,
    responsible,
  }: ICreateLocationDTO): Promise<Location> {
    const location = new Location();

    Object.assign(location, {
      id: v4(),
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
      creature_type,
      sect,
      responsible,
    });

    this.locations.push(location);

    return location;
  }

  public async update(location: Location): Promise<Location> {
    this.locations = this.locations.map(oldLocation =>
      oldLocation.id !== location.id ? oldLocation : location,
    );

    return location;
  }

  public async findById(Location_id: string): Promise<Location | undefined> {
    const findLocation = this.locations.find(
      location => location.id === Location_id,
    );

    return findLocation;
  }

  public async findByCharacterId(
    char_id: string,
    char_clan: string,
    char_creature_type: string,
    char_sect: string,
  ): Promise<Location[]> {
    const locationList = this.locations.filter(
      location =>
        location.responsible === char_id ||
        location.property === 'public' ||
        (location.creature_type !== undefined &&
          location.creature_type === char_creature_type) ||
        (location.sect !== undefined && location.sect === char_sect) ||
        (location.clan !== undefined && location.clan === char_clan),
    );

    return locationList;
  }

  public async listAll(): Promise<Location[]> {
    return this.locations;
  }

  public async delete(location_id: string): Promise<void> {
    const listWithRemovedLocations = this.locations.filter(
      location => location.id !== location_id,
    );
    this.locations = listWithRemovedLocations;
  }
}

export default FakeLocationsRepository;
