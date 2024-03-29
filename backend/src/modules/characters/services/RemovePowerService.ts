import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IPowersRepository from '@modules/characters/repositories/IPowersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ISaveRouteResultProvider from '@shared/container/providers/SaveRouteResultProvider/models/ISaveRouteResultProvider';

interface IRequestDTO {
  user_id: string;
  power_id: string;
}

@injectable()
class RemovePowerService {
  constructor(
    @inject('PowersRepository')
    private powersRepository: IPowersRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('SaveRouteResultProvider')
    private saveRouteResult: ISaveRouteResultProvider,
  ) {}

  public async execute({ user_id, power_id }: IRequestDTO): Promise<void> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated Storytellers can remove powers',
        401,
      );
    } else if (!user.storyteller) {
      throw new AppError(
        'Only authenticated Storytellers remove add powers',
        401,
      );
    }

    const power = await this.powersRepository.findById(power_id);

    if (!power) {
      throw new AppError('Power not found', 400);
    }

    // Remove route result when reset a character traits
    this.saveRouteResult.remove('PowersList');

    await this.powersRepository.delete(power_id);
  }
}

export default RemovePowerService;
