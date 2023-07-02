import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICurrentActionMonthProvider from '@modules/influences/providers/CurrentActionMonthProvider/models/ICurrentActionMonthProvider';

interface IRequestDTO {
  user_id: string;
}

@injectable()
class GetCurrentActionMonthService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('CurrentActionMonthProvider')
    private actionMonthProvider: ICurrentActionMonthProvider,
  ) {}

  public async execute({ user_id }: IRequestDTO): Promise<string> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated users can get the current action month',
        401,
      );
    }

    return this.actionMonthProvider.get();
  }
}

export default GetCurrentActionMonthService;
