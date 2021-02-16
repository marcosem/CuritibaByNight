import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Territory from '@modules/locations/infra/typeorm/entities/Territory';
import ITerritoriesRepository from '@modules/locations/repositories/ITerritoriesRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequestDTO {
  user_id: string;
}

@injectable()
class GetTerritoriesListService {
  constructor(
    @inject('TerritoriesRepository')
    private territoriesRepository: ITerritoriesRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id }: IRequestDTO): Promise<Territory[]> {
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

    const territoryList = await this.territoriesRepository.listAll();

    return territoryList;
  }
}

export default GetTerritoriesListService;
