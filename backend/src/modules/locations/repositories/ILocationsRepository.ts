import Location from '@modules/locations/infra/typeorm/entities/Location';
import ICreateLocationDTO from '@modules/locations/dtos/ICreateLocationDTO';

export default interface ILocationsRepository {
  create(data: ICreateLocationDTO): Promise<Location>;
  update(data: Location): Promise<Location>;
  findById(location_id: string): Promise<Location | undefined>;
  findByCharacterId(
    char_id: string,
    char_clan: string,
    char_creature_type: string,
    char_sect: string,
  ): Promise<Location[]>;
  listAll(): Promise<Location[]>;
  delete(location_id: string): Promise<void>;
}
