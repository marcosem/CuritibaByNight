import LocationCharacter from '@modules/locations/infra/typeorm/entities/LocationCharacter';
import ILocationsCharactersRepository from '@modules/locations/repositories/ILocationsCharactersRepository';

import { uuid } from 'uuidv4';

class FakeLocationsCharactersRepository
  implements ILocationsCharactersRepository {
  private locationsCharacters: LocationCharacter[] = [];

  public async addCharToLocation(
    char_id: string,
    location_id: string,
  ): Promise<LocationCharacter> {
    const locationCharacter = new LocationCharacter();

    Object.assign(locationCharacter, {
      id: uuid(),
      character_id: char_id,
      location_id,
    });

    this.locationsCharacters.push(locationCharacter);

    return locationCharacter;
  }

  public async delete(char_id: string, location_id: string): Promise<void> {
    const listWithRemovedElements = this.locationsCharacters.filter(
      locChar =>
        locChar.location_id !== location_id || locChar.character_id !== char_id,
    );

    this.locationsCharacters = listWithRemovedElements;
  }

  public async find(
    char_id: string,
    location_id: string,
  ): Promise<LocationCharacter | undefined> {
    const findLocationChar = this.locationsCharacters.find(
      locChar =>
        locChar.location_id === location_id && locChar.character_id === char_id,
    );

    return findLocationChar;
  }

  public async listLocationsByCharacter(char_id: string): Promise<string[]> {
    const resultList: string[] = [];

    this.locationsCharacters.forEach(locChar => {
      if (locChar.character_id === char_id)
        resultList.push(locChar.location_id);
    });

    return resultList;
  }

  public async listCharactersByLocation(
    location_id: string,
  ): Promise<string[]> {
    const resultList: string[] = [];

    this.locationsCharacters.forEach(locChar => {
      if (locChar.location_id === location_id)
        resultList.push(locChar.character_id);
    });

    return resultList;
  }
}

export default FakeLocationsCharactersRepository;