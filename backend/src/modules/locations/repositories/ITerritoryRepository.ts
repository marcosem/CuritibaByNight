import Territory from '@modules/locations/infra/typeorm/entities/Territory';
import ICreateTerritoryDTO from '@modules/locations/dtos/ICreateTerritoryDTO';

export default interface ITerritoryRepository {
  create(data: ICreateTerritoryDTO): Promise<Territory>;
  update(data: Territory): Promise<Territory>;
  findById(territory_id: string): Promise<Territory | undefined>;
  findByName(territory_name: string): Promise<Territory | undefined>;
  listAll(): Promise<Territory[]>;
  delete(territory_id: string): Promise<void>;
}
