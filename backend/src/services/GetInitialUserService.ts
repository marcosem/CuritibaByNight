import { getCustomRepository } from 'typeorm';
import { isUuid } from 'uuidv4';
import User from '../models/User';
import UsersRepository from '../repositories/UsersRepository';
import AppError from '../errors/AppError';

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
