import { getRepository, Repository } from 'typeorm';

import LocationCharacter from '@modules/locations/infra/typeorm/entities/LocationCharacter';
import ILocationsCharactersRepository from '@modules/locations/repositories/ILocationsCharactersRepository';

class LocationsCharactersRepository implements ILocationsCharactersRepository {
  private ormRepository: Repository<LocationCharacter>;

  constructor() {
    this.ormRepository = getRepository(LocationCharacter);
  }

  public async addCharToLocation(
    char_id: string,
    location_id: string,
  ): Promise<LocationCharacter> {
    const locChar = this.ormRepository.create({
      character_id: char_id,
      location_id,
    });

    await this.ormRepository.save(locChar);

    let savedLocChar = await this.find(char_id, location_id);
    if (!savedLocChar) {
      savedLocChar = locChar;
    }

    return savedLocChar;
  }

  public async delete(char_id: string, location_id: string): Promise<void> {
    const locChar = await this.ormRepository.findOne({
      where: { character_id: char_id, location_id },
    });

    if (locChar) {
      await this.ormRepository.remove(locChar);
    }
  }

  public async find(
    char_id: string,
    location_id: string,
  ): Promise<LocationCharacter | undefined> {
    const locChar = await this.ormRepository.findOne({
      where: { character_id: char_id, location_id },
      relations: ['characterId', 'locationId'],
    });

    return locChar;
  }

  public async listLocationsByCharacter(char_id: string): Promise<string[]> {
    const resultList: string[] = [];

    const locCharList = await this.ormRepository.find({
      where: { character_id: char_id },
    });

    locCharList.forEach(locChar => resultList.push(locChar.location_id));

    return resultList;
  }

  public async listCharactersByLocation(
    location_id: string,
  ): Promise<string[]> {
    const resultList: string[] = [];

    const locCharList = await this.ormRepository.find({
      where: { location_id },
    });

    locCharList.forEach(locChar => resultList.push(locChar.character_id));

    return resultList;
  }
}

export default LocationsCharactersRepository;
