import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Territory from '@modules/locations/infra/typeorm/entities/Territory';
import ITerritoriesRepository from '@modules/locations/repositories/ITerritoriesRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequestDTO {
  user_id: string;
  name: string;
  population: number;
  sect?: string;
}

@injectable()
class AddTerritoryService {
  constructor(
    @inject('TerritoriesRepository')
    private territoriesRepository: ITerritoriesRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
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

    const territory = await this.territoriesRepository.create({
      name,
      population,
      sect,
    });

    return territory;
  }
}

export default AddTerritoryService;
