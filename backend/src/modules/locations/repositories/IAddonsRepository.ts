import Addon from '@modules/locations/infra/typeorm/entities/Addon';
import ICreateAddonDTO from '@modules/locations/dtos/ICreateAddonDTO';

export default interface IAddonsRepository {
  create(data: ICreateAddonDTO): Promise<Addon>;
  update(data: Addon): Promise<Addon>;
  findById(addon_id: string): Promise<Addon | undefined>;
  findByNameLevel(
    addon_name: string,
    addon_level: number,
    warrens: boolean,
  ): Promise<Addon | undefined>;
  findFirstByName(
    addon_name: string,
    warrens: boolean,
  ): Promise<Addon | undefined>;
  listAll(allow_duplicated: boolean, warrens: boolean): Promise<Addon[]>;
  listByName(addon_name: string): Promise<Addon[]>;
  delete(addon_id: string): Promise<void>;
}
