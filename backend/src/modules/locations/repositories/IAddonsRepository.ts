import Addon from '@modules/locations/infra/typeorm/entities/Addon';
import ICreateAddonDTO from '@modules/locations/dtos/ICreateAddonDTO';

export default interface IAddonsRepository {
  create(data: ICreateAddonDTO): Promise<Addon>;
  update(data: Addon): Promise<Addon>;
  findById(addon_id: string): Promise<Addon | undefined>;
  findByNameLevel(
    addon_name: string,
    addon_level: number,
  ): Promise<Addon | undefined>;
  findFirstByName(addon_name: string): Promise<Addon | undefined>;
  listAll(allow_duplicated: boolean): Promise<Addon[]>;
  listByName(addon_name: string): Promise<Addon[]>;
  delete(addon_id: string): Promise<void>;
}
