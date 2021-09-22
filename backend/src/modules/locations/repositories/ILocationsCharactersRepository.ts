import LocationCharacter from '@modules/locations/infra/typeorm/entities/LocationCharacter';

export default interface ILocationsCharactersRepository {
  addCharToLocation(
    char_id: string,
    location_id: string,
    shared: boolean,
  ): Promise<LocationCharacter>;
  updateCharLocation(
    char_id: string,
    location_id: string,
    shared: boolean,
  ): Promise<LocationCharacter>;
  delete(char_id: string, location_id: string): Promise<void>;
  find(
    char_id: string,
    location_id: string,
  ): Promise<LocationCharacter | undefined>;
  listLocationsByCharacter(char_id: string): Promise<LocationCharacter[]>;
  listCharactersByLocation(location_id: string): Promise<LocationCharacter[]>;
}
