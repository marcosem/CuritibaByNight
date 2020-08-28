import { injectable, inject } from 'tsyringe';
import { isUuid } from 'uuidv4';

import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

interface IRequestDTO {
  name: string;
  email: string;
  email_ic: string;
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
    email_ic,
    phone,
    password,
    secret,
  }: IRequestDTO): Promise<User> {
    if (!isUuid(secret)) {
      throw new AppError('Invalid Token.', 401);
    }

    // Search user by provided secret
    const userSecretExist = await this.usersRepository.findBySecret(secret);

    if (!userSecretExist) {
      throw new AppError('Invalid Token.', 401);
    }

    // if Email IC and Email are equal, store only Email
    let redefEmailIc;
    if (email_ic) {
      if (email_ic === email) {
        redefEmailIc = '';
      } else {
        redefEmailIc = email_ic;
      }
    } else {
      redefEmailIc = '';
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    userSecretExist.name = name;
    userSecretExist.email = email;
    userSecretExist.phone = phone;
    userSecretExist.email_ic = redefEmailIc;
    userSecretExist.storyteller = false;
    userSecretExist.password = hashedPassword;
    userSecretExist.secret = '';

    const user = this.usersRepository.update(userSecretExist);

    return user;
  }
}

export default CreateInitialUserService;
