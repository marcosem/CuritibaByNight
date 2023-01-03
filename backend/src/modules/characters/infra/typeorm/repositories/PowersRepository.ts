import { getRepository, Repository } from 'typeorm';
import Power from '@modules/characters/infra/typeorm/entities/Power';
import ICreatePowerDTO from '@modules/characters/dtos/ICreatePowerDTO';
import IPowersRepository from '@modules/characters/repositories/IPowersRepository';

class PowersRepository implements IPowersRepository {
  private ormRepository: Repository<Power>;

  constructor() {
    this.ormRepository = getRepository(Power);
  }

  public async create({
    long_name,
    short_name,
    level = -1,
    type = '',
    origin = '',
    requirements = '',
    description,
    system,
    cost = 0,
    source = '',
  }: ICreatePowerDTO): Promise<Power> {
    const power = this.ormRepository.create({
      long_name,
      short_name,
      level,
      type,
      origin,
      requirements,
      description,
      system,
      cost,
      source,
    });

    await this.ormRepository.save(power);

    return power;
  }

  public async update(power: Power): Promise<Power> {
    await this.ormRepository.save(power);

    // Return what is saved with user relationship attached.
    let savedPower = await this.findById(power.id);

    if (!savedPower) {
      savedPower = power;
    }

    return savedPower;
  }

  public async findById(power_id: string): Promise<Power | undefined> {
    const powerFound = await this.ormRepository.findOne({
      where: { id: power_id },
    });

    // if not found, return undefined
    return powerFound;
  }

  public async findByName(
    name: string,
    level = -1,
  ): Promise<Power | undefined> {
    const where = [
      { long_name: name, level },
      { short_name: name, level },
    ];

    const powerList = await this.ormRepository.findOne({
      where,
      order: { short_name: 'ASC', level: 'ASC' },
    });

    // if not found, return undefined
    return powerList;
  }

  public async listAll(): Promise<Power[]> {
    const powerList = await this.ormRepository.find({
      order: { short_name: 'ASC', level: 'ASC' },
    });

    return powerList;
  }

  public async listByNames(powersNames: Power[]): Promise<Power[]> {
    const where = powersNames.map(power => {
      const newWhere = [
        {
          long_name: power.long_name,
          level: power.level,
        },
        {
          short_name: power.short_name,
          level: power.level,
        },
      ];

      return newWhere;
    });

    const powerList = await this.ormRepository.find({
      where,
      order: { short_name: 'ASC', level: 'ASC' },
    });

    return powerList;
  }

  public async listByType(type: string): Promise<Power[]> {
    const where = {
      type,
    };

    const powerList = await this.ormRepository.find({
      where,
      order: { short_name: 'ASC', level: 'ASC' },
    });

    return powerList;
  }

  public async delete(power_id: string): Promise<void> {
    const location = await this.ormRepository.findOne({
      where: { id: power_id },
    });

    if (location) {
      await this.ormRepository.remove(location);
    }
  }
}

export default PowersRepository;
