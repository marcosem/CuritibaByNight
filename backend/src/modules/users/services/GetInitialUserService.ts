import { injectable, inject } from 'tsyringe';
import { validate } from 'uuid';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequestDTO {
  secret: string;
}

@injectable()
class GetInitialUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ secret }: IRequestDTO): Promise<User> {
    if (!validate(secret)) {
      throw new AppError('Invalid Token', 401);
    }

    // Search user by provided secret
    const userSecretExist = await this.usersRepository.findBySecret(secret);

    if (!userSecretExist) {
      throw new AppError('Invalid Token', 401);
    }

    return userSecretExist;
  }
}

export default GetInitialUserService;
