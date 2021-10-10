import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IAddonsRepository from '@modules/locations/repositories/IAddonsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequestDTO {
  user_id: string;
  warrens: boolean;
}

@injectable()
class GetAddonsArrayService {
  constructor(
    @inject('AddonsRepository')
    private addonsRepository: IAddonsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id, warrens }: IRequestDTO): Promise<string[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated user can get addons list', 401);
    }

    const addonsList = await this.addonsRepository.listAll(false, warrens);
    const addonsArrayList = addonsList.map(addon => addon.name);

    return addonsArrayList;
  }
}

export default GetAddonsArrayService;
