import { getRepository, Repository, Not } from 'typeorm';
import Addon from '@modules/locations/infra/typeorm/entities/Addon';
import ICreateAddonDTO from '@modules/locations/dtos/ICreateAddonDTO';
import IAddonsRepository from '@modules/locations/repositories/IAddonsRepository';

class AddonsRepository implements IAddonsRepository {
  private ormRepository: Repository<Addon>;

  constructor() {
    this.ormRepository = getRepository(Addon);
  }

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
    const addon = this.ormRepository.create({
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

    await this.ormRepository.save(addon);

    let savedAddon = await this.findById(addon.id);
    if (!savedAddon) {
      savedAddon = addon;
    }

    return savedAddon;
  }

  public async update(addon: Addon): Promise<Addon> {
    await this.ormRepository.save(addon);

    let savedAddon = await this.findById(addon.id);
    if (!savedAddon) {
      savedAddon = addon;
    }

    return savedAddon;
  }

  public async findById(addon_id: string): Promise<Addon | undefined> {
    const addonFound = await this.ormRepository.findOne({
      where: { id: addon_id },
    });

    // if not found, return undefined
    return addonFound;
  }

  public async findByNameLevel(
    addon_name: string,
    addon_level: number,
    warrens = false,
  ): Promise<Addon | undefined> {
    let addonFound: Addon | undefined;

    if (warrens) {
      const addons = await this.ormRepository.find({
        where: { name: addon_name, level: addon_level },
      });

      if (addons.length > 0) {
        if (addons.length === 1) {
          [addonFound] = addons;
        } else {
          addonFound = addons.find(
            addon => addon.req_other === 'Warrens Nosferatu',
          );
        }
      }
    } else {
      addonFound = await this.ormRepository.findOne({
        where: {
          name: addon_name,
          level: addon_level,
          req_other: Not('Warrens Nosferatu'),
        },
      });
    }

    // if not found, return undefined
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
    let addonList: Addon[];

    if (allow_duplicated) {
      addonList = await this.ormRepository.find({
        order: { name: 'ASC', level: 'ASC' },
      });
    } else if (warrens) {
      addonList = await this.ormRepository
        .createQueryBuilder()
        .distinctOn(['name'])
        .orderBy('name')
        .getMany();
    } else {
      addonList = await this.ormRepository
        .createQueryBuilder()
        .where('req_other = :warren', { warren: Not('Warrens Nosferatu') })
        .distinctOn(['name'])
        .orderBy('name')
        .getMany();
    }

    return addonList;
  }

  public async listByName(addon_name: string): Promise<Addon[]> {
    const addonList = await this.ormRepository.find({
      where: { name: addon_name },
      order: { level: 'ASC' },
    });

    return addonList;
  }

  public async delete(addon_id: string): Promise<void> {
    const addon = await this.ormRepository.findOne({
      where: { id: addon_id },
    });

    if (addon) {
      await this.ormRepository.remove(addon);
    }
  }
}

export default AddonsRepository;
