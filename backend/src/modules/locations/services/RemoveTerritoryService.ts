import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import ITerritoriesRepository from '@modules/locations/repositories/ITerritoriesRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequestDTO {
  user_id: string;
  territory_id: string;
}

@injectable()
class RemoveTerritoryService {
  constructor(
    @inject('TerritoriesRepository')
    private territoriesRepository: ITerritoriesRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id, territory_id }: IRequestDTO): Promise<void> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated Storytellers can remove territories',
        401,
      );
    } else if (!user.storyteller) {
      throw new AppError(
        'Only authenticated Storytellers can remove territories',
        401,
      );
    }

    const territory = await this.territoriesRepository.findById(territory_id);

    if (!territory) {
      throw new AppError('Territory not found', 400);
    }

    await this.territoriesRepository.delete(territory.id);
  }
}

export default RemoveTerritoryService;
