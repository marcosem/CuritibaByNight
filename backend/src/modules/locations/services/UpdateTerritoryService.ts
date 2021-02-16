import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Territory from '@modules/locations/infra/typeorm/entities/Territory';
import ITerritoriesRepository from '@modules/locations/repositories/ITerritoriesRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequestDTO {
  user_id: string;
  territory_id: string;
  name: string;
  population: number;
  sect?: string;
}

@injectable()
class UpdateTerritoryService {
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
    population,
    sect,
  }: IRequestDTO): Promise<Territory> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated Storytellers can add territories',
        401,
      );
    } else if (!user.storyteller) {
      throw new AppError(
        'Only authenticated Storytellers can add territories',
        401,
      );
    }

    const territory = await this.territoriesRepository.findById(territory_id);

    if (!territory) {
      throw new AppError('Territory not found', 400);
    }

    territory.name = name;
    territory.population = population;
    if (sect) territory.sect = sect;

    await this.territoriesRepository.update(territory);

    return territory;
  }
}

export default UpdateTerritoryService;
