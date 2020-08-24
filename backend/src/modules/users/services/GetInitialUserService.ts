import { getCustomRepository } from 'typeorm';
import { isUuid } from 'uuidv4';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import UsersRepository from '@modules/users/repositories/UsersRepository';

interface RequestDTO {
  secret: string;
}

class GetInitialUserService {
  public async execute({ secret }: RequestDTO): Promise<User> {
    const usersRepository = getCustomRepository(UsersRepository);

    if (!isUuid(secret)) {
      throw new AppError('Invalid Token.', 401);
    }

    // Search user by provided secret
    const userSecretExist = await usersRepository.findUserBySecret(secret);

    if (!userSecretExist) {
      throw new AppError('Invalid Token.', 401);
    }

    return userSecretExist;
  }
}

export default GetInitialUserService;
