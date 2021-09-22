import Addon from '@modules/locations/infra/typeorm/entities/Addon';
import ICreateAddonDTO from '@modules/locations/dtos/ICreateAddonDTO';
import IAddonsRepository from '@modules/locations/repositories/IAddonsRepository';

import { v4 } from 'uuid';

class FakeAddonsRepository implements IAddonsRepository {
  private addons: Addon[] = [];

  public async create({
    name,
    level = 0,
    description,
    defense = 0,
    surveillance = 0,
    req_background = null,
    req_merit = null,
    req_influence = null,
    req_other = null,
    req_addon_1 = null,
    req_addon_2 = null,
    req_addon_3 = null,
    ability,
    ability_qty,
    influence,
    influence_qty,
    time_qty,
    time_type,
  }: ICreateAddonDTO): Promise<Addon> {
    const addon = new Addon();

    Object.assign(addon, {
      id: v4(),
      name,
      level,
      description,
      defense,
      surveillance,
      req_background,
      req_merit,
      req_influence,
      req_other,
      req_addon_1,
      req_addon_2,
      req_addon_3,
      ability,
      ability_qty,
      influence,
      influence_qty,
      time_qty,
      time_type,
    });

    this.addons.push(addon);

    return addon;
  }

  public async update(addon: Addon): Promise<Addon> {
    this.addons = this.addons.map(oldAddon =>
      oldAddon.id !== addon.id ? oldAddon : addon,
    );

    return addon;
  }

  public async findById(addon_id: string): Promise<Addon | undefined> {
    const findAddon = this.addons.find(addon => addon.id === addon_id);

    return findAddon;
  }

  public async findByNameLevel(
    addon_name: string,
    addon_level: number,
    warrens = false,
  ): Promise<Addon | undefined> {
    let addonFound: Addon | undefined;

    if (warrens) {
      const myAddons = this.addons.filter(
        addon => addon.name === addon_name && addon.level === addon_level,
      );

      if (myAddons.length > 0) {
        if (myAddons.length === 1) {
          [addonFound] = myAddons;
        } else {
          addonFound = myAddons.find(
            addon => addon.req_other === 'Warrens Nosferatu',
          );
        }
      }
    } else {
      addonFound = this.addons.find(
        addon =>
          addon.name === addon_name &&
          addon.level === addon_level &&
          addon.req_other !== 'Warrens Nosferatu',
      );
    }

    return addonFound;
  }

  public async findFirstByName(
    addon_name: string,
    warrens = false,
  ): Promise<Addon | undefined> {
    return this.findByNameLevel(addon_name, 1, warrens);
  }

  public async listAll(
    allow_duplicated = true,
    warrens = false,
  ): Promise<Addon[]> {
    if (allow_duplicated) return this.addons;

    const addedAddon: string[] = [];
    const addonsNotDuplicated = this.addons.filter(addon => {
      if (
        addedAddon.indexOf(addon.name) === -1 &&
        (warrens || addon.req_other !== 'Warrens Nosferatu')
      ) {
        addedAddon.push(addon.name);
        return true;
      }

      return false;
    });

    return addonsNotDuplicated;
  }

  public async listByName(addon_name: string): Promise<Addon[]> {
    const addonsByName = this.addons.filter(addon => addon.name === addon_name);

    return addonsByName;
  }

  public async delete(addon_id: string): Promise<void> {
    const listWithRemovedAddon = this.addons.filter(
      addon => addon.id !== addon_id,
    );

    this.addons = listWithRemovedAddon;
  }
}

export default FakeAddonsRepository;
