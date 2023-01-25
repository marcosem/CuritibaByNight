import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Power from '@modules/characters/infra/typeorm/entities/Power';
import IPowersRepository from '@modules/characters/repositories/IPowersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequestDTO {
  user_id: string;
  power_id: string;
  long_name: string;
  short_name: string;
  level?: number;
  type?: string;
  origin?: string;
  requirements?: string;
  description: string;
  system: string;
  cost?: number;
  source?: string;
}

@injectable()
class UpdatePowerService {
  constructor(
    @inject('PowersRepository')
    private powersRepository: IPowersRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    power_id,
    long_name,
    short_name,
    level = 0,
    type = 'other',
    origin = '',
    requirements = '',
    description,
    system,
    cost = 0,
    source = '',
  }: IRequestDTO): Promise<Power> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated Storytellers can update powers',
        401,
      );
    } else if (!user.storyteller) {
      throw new AppError(
        'Only authenticated Storytellers can update powers',
        401,
      );
    }

    const power = await this.powersRepository.findById(power_id);

    if (!power) {
      throw new AppError('Power not found', 400);
    }

    if (power.long_name !== long_name) {
      throw new AppError('Power name does not match', 400);
    }

    if (Number(power.level) !== Number(level)) {
      throw new AppError('Power level does not match', 400);
    }

    power.short_name = short_name;
    power.type = type;
    power.origin = origin;
    power.requirements = requirements;
    power.description = description;
    power.system = system;
    power.cost = cost;
    power.source = source;

    const savedPower = await this.powersRepository.update(power);

    return savedPower;
  }
}

export default UpdatePowerService;
