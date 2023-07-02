import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICurrentActionMonthProvider from '@modules/influences/providers/CurrentActionMonthProvider/models/ICurrentActionMonthProvider';

interface IRequestDTO {
  user_id: string;
  action_month: string;
}

@injectable()
class SetCurrentActionMonthService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('CurrentActionMonthProvider')
    private actionMonthProvider: ICurrentActionMonthProvider,
  ) {}

  public async execute({ user_id, action_month }: IRequestDTO): Promise<void> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated Storytellers can upload character sheets',
        401,
      );
    } else if (!user.storyteller) {
      throw new AppError(
        'Only authenticated Storytellers can upload character sheets',
        401,
      );
    }

    const result = this.actionMonthProvider.set(action_month);

    if (!result) {
      throw new AppError('Action Month should follow the format YYYY-MM', 400);
    }
  }
}

export default SetCurrentActionMonthService;
