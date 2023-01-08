import Power from '@modules/characters/infra/typeorm/entities/Power';
import ICreatePowerDTO from '@modules/characters/dtos/ICreatePowerDTO';
import IPowersRepository from '@modules/characters/repositories/IPowersRepository';

import { v4 } from 'uuid';

class FakePowersRepository implements IPowersRepository {
  private powers: Power[] = [];

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
    const power = new Power();

    Object.assign(power, {
      id: v4(),
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

    this.powers.push(power);

    return power;
  }

  public async update(newPower: Power): Promise<Power> {
    this.powers = this.powers.map(oldPower =>
      oldPower.id !== newPower.id ? oldPower : newPower,
    );

    return newPower;
  }

  public async findById(power_id: string): Promise<Power | undefined> {
    const myPower = this.powers.find(power => power.id === power_id);

    return myPower;
  }

  public async findByName(
    name: string,
    level = -1,
  ): Promise<Power | undefined> {
    const myPower = this.powers.find(
      power => power.long_name === name && power.level === level,
    );

    return myPower;
  }

  public async listAll(): Promise<Power[]> {
    return this.powers;
  }

  public async listByNames(powersNames: Power[]): Promise<Power[]> {
    const myPowersNames: Power[] = powersNames
      .map(power => {
        const fakePower: Power = {
          long_name: 'remove',
          short_name: '',
          description: '',
          system: '',
        } as Power;

        const newPower: Power =
          this.powers.find(
            myPower =>
              (myPower.long_name === power.long_name ||
                myPower.short_name === power.short_name) &&
              myPower.level === power.level,
          ) || fakePower;

        return newPower;
      })
      .filter(power => power.long_name !== 'remove');

    return myPowersNames;
  }

  public async listByType(type: string): Promise<Power[]> {
    const myPowersType: Power[] = this.powers.filter(
      power => power.type === type,
    );

    return myPowersType;
  }

  public async delete(power_id: string): Promise<void> {
    const listWithRemovedPower = this.powers.filter(
      power => power.id !== power_id,
    );
    this.powers = listWithRemovedPower;
  }
}

export default FakePowersRepository;
