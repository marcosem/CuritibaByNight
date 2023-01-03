import Power from '@modules/characters/infra/typeorm/entities/Power';
import ICreatePowerDTO from '@modules/characters/dtos/ICreatePowerDTO';

export default interface IPowerRepository {
  create(data: ICreatePowerDTO): Promise<Power>;
  update(data: Power): Promise<Power>;
  findById(power_id: string): Promise<Power | undefined>;
  findByName(name: string, level: number): Promise<Power | undefined>;
  listAll(): Promise<Power[]>;
  listByNames(powersNames: Power[]): Promise<Power[]>;
  listByType(type: string): Promise<Power[]>;
  delete(power_id: string): Promise<void>;
}
