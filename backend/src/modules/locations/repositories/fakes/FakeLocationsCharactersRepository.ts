import LocationCharacter from '@modules/locations/infra/typeorm/entities/LocationCharacter';
import ILocationsCharactersRepository from '@modules/locations/repositories/ILocationsCharactersRepository';

import { v4 } from 'uuid';

class FakeLocationsCharactersRepository
  implements ILocationsCharactersRepository {
  private locationsCharacters: LocationCharacter[] = [];

  public async addCharToLocation(
    char_id: string,
    location_id: string,
    shared: boolean,
  ): Promise<LocationCharacter> {
    const locationCharacter = new LocationCharacter();

    Object.assign(locationCharacter, {
      id: v4(),
      character_id: char_id,
      location_id,
      shared,
    });

    this.locationsCharacters.push(locationCharacter);

    return locationCharacter;
  }

  public async updateCharLocation(
    char_id: string,
    location_id: string,
    shared: boolean,
  ): Promise<LocationCharacter> {
    let updatedLocation: LocationCharacter = {} as LocationCharacter;

    this.locationsCharacters = this.locationsCharacters.map(oldLocChar => {
      const newLocChar = oldLocChar;
      if (
        oldLocChar.character_id === char_id &&
        oldLocChar.location_id === location_id
      ) {
        newLocChar.shared = shared;
        updatedLocation = newLocChar;
      }

      return updatedLocation;
    });

    return updatedLocation;
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
  ): Promise<LocationCharacter[]> {
    let resultList: LocationCharacter[] = [];

    resultList = this.locationsCharacters.filter(
      locChar => locChar.location_id === location_id,
    );

    return resultList;
  }
}

export default FakeLocationsCharactersRepository;
