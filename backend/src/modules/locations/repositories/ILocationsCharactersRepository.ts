import LocationCharacter from '@modules/locations/infra/typeorm/entities/LocationCharacter';

export default interface ILocationsCharacters {
  addCharToLocation(
    char_id: string,
    location_id: string,
  ): Promise<LocationCharacter>;
  delete(char_id: string, location_id: string): Promise<void>;
  find(
    char_id: string,
    location_id: string,
  ): Promise<LocationCharacter | undefined>;
  listLocationsByCharacter(char_id: string): Promise<string[]>;
  listCharactersByLocation(location_id: string): Promise<string[]>;
}
