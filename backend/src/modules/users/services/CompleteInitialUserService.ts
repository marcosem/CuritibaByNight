import { injectable, inject } from 'tsyringe';
import { validate } from 'uuid';

import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

interface IRequestDTO {
  name: string;
  email: string;
  phone: string;
  password: string;
  secret: string;
}

@injectable()
class CreateInitialUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    name,
    email,
    phone,
    password,
    secret,
  }: IRequestDTO): Promise<User> {
    if (!validate(secret)) {
      throw new AppError('Invalid Token', 401);
    }

    // Search user by provided secret
    const userSecretExist = await this.usersRepository.findBySecret(secret);

    if (!userSecretExist) {
      throw new AppError('Invalid Token', 401);
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    userSecretExist.name = name;
    userSecretExist.email = email;
    userSecretExist.phone = phone;
    userSecretExist.storyteller = false;
    userSecretExist.password = hashedPassword;
    userSecretExist.secret = '';

    const user = this.usersRepository.update(userSecretExist);

    return user;
  }
}

export default CreateInitialUserService;
