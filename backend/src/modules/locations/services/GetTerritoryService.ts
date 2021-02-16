import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Territory from '@modules/locations/infra/typeorm/entities/Territory';
import ITerritoriesRepository from '@modules/locations/repositories/ITerritoriesRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequestDTO {
  user_id: string;
  territory_id?: string;
  name?: string;
}

@injectable()
class GetTerritoryService {
  constructor(
    @inject('TerritoriesRepository')
    private territoriesRepository: ITerritoriesRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    territory_id,
    name,
  }: IRequestDTO): Promise<Territory> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated Storytellers can get a territory',
        401,
      );
    } else if (!user.storyteller) {
      throw new AppError(
        'Only authenticated Storytellers can get a territory',
        401,
      );
    }

    let territory;

    if (territory_id) {
      territory = await this.territoriesRepository.findById(territory_id);
    } else if (name) {
      territory = await this.territoriesRepository.findByName(name);
    }

    if (!territory_id && !name) {
      throw new AppError(
        'A territory name or territory id should be provided',
        400,
      );
    }

    if (!territory) {
      throw new AppError('Territory not found', 400);
    }

    return territory;
  }
}

export default GetTerritoryService;
