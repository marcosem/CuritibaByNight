import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Power from '@modules/characters/infra/typeorm/entities/Power';
import ICharactersTraitsRepository from '@modules/characters/repositories/ICharactersTraitsRepository';
import IPowersRepository from '@modules/characters/repositories/IPowersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequestDTO {
  user_id: string;
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
class CreatePowerService {
  constructor(
    @inject('PowersRepository')
    private powersRepository: IPowersRepository,
    @inject('CharactersTraitsRepository')
    private charactersTraitsRepository: ICharactersTraitsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
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
      throw new AppError('Only authenticated Storytellers can add powers', 401);
    } else if (!user.storyteller) {
      throw new AppError('Only authenticated Storytellers can add powers', 401);
    }

    const charTraitExist = await this.charactersTraitsRepository.traitLevelExist(
      long_name,
      level,
    );

    if (!charTraitExist) {
      throw new AppError('None of the characters have this power', 400);
    }

    const power = await this.powersRepository.findByName(long_name, level);

    if (power) {
      throw new AppError('This power already exists', 400);
    }

    const newPower = {
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
    };

    const savedPower = await this.powersRepository.create(newPower);

    return savedPower;
  }
}

export default CreatePowerService;
