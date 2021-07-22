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
    shared: boolean,
  ): Promise<LocationCharacter> {
    const locChar = this.ormRepository.create({
      character_id: char_id,
      location_id,
      shared,
    });

    await this.ormRepository.save(locChar);

    let savedLocChar = await this.find(char_id, location_id);
    if (!savedLocChar) {
      savedLocChar = locChar;
    }

    return savedLocChar;
  }

  public async updateCharLocation(
    char_id: string,
    location_id: string,
    shared: boolean,
  ): Promise<LocationCharacter> {
    let locChar = await this.find(char_id, location_id);

    if (locChar) {
      if (shared !== locChar.shared) {
        locChar.shared = shared;
        await this.ormRepository.save(locChar);
      }
    } else {
      locChar = {
        character_id: char_id,
        location_id,
        shared,
      } as LocationCharacter;
    }

    return locChar;
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

  public async listLocationsByCharacter(
    char_id: string,
  ): Promise<LocationCharacter[]> {
    const resultList: LocationCharacter[] = [];

    const locCharList = await this.ormRepository.find({
      where: { character_id: char_id },
    });

    locCharList.forEach(locChar => resultList.push(locChar));

    return resultList;
  }

  public async listCharactersByLocation(
    location_id: string,
  ): Promise<LocationCharacter[]> {
    let locCharList: LocationCharacter[] = [];

    locCharList = await this.ormRepository.find({
      where: { location_id },
      relations: ['characterId'],
    });

    locCharList.sort((a, b) => {
      const nameA = a.characterId
        ? a.characterId.name
            .toUpperCase()
            .replace(/[ÁÀÃÂ]/gi, 'A')
            .replace(/[ÉÊ]/gi, 'E')
            .replace(/[Í]/gi, 'I')
            .replace(/[ÓÔÕ]/gi, 'O')
            .replace(/[Ú]/gi, 'U')
        : '';
      const nameB = b.characterId
        ? b.characterId.name
            .toUpperCase()
            .replace(/[ÁÀÃÂ]/gi, 'A')
            .replace(/[ÉÊ]/gi, 'E')
            .replace(/[Í]/gi, 'I')
            .replace(/[ÓÔÕ]/gi, 'O')
            .replace(/[Ú]/gi, 'U')
        : '';

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      return 0;
    });

    return locCharList;
  }
}

export default LocationsCharactersRepository;
