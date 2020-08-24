import { isUuid } from 'uuidv4';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUserRepository from '@modules/users/repositories/IUsersRepository';

interface IRequestDTO {
  secret: string;
}

class GetInitialUserService {
  constructor(private usersRepository: IUserRepository) {}

  public async execute({ secret }: IRequestDTO): Promise<User> {
    if (!isUuid(secret)) {
      throw new AppError('Invalid Token.', 401);
    }

    // Search user by provided secret
    const userSecretExist = await this.usersRepository.findBySecret(secret);

    if (!userSecretExist) {
      throw new AppError('Invalid Token.', 401);
    }

    return userSecretExist;
  }
}

export default GetInitialUserService;
