import { getCustomRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import { isUuid } from 'uuidv4';

import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

interface IRequestDTO {
  name: string;
  email: string;
  email_ic: string;
  phone: string;
  password: string;
  secret: string;
}

class CreateInitialUserService {
  public async execute({
    name,
    email,
    email_ic,
    phone,
    password,
    secret,
  }: IRequestDTO): Promise<User> {
    const usersRepository = getCustomRepository(UsersRepository);

    if (!isUuid(secret)) {
      throw new AppError('Invalid Token.', 401);
    }

    // Search user by provided secret
    const userSecretExist = await usersRepository.findUserBySecret(secret);

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

    const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      id: userSecretExist.id,
      name,
      email,
      phone,
      email_ic: redefEmailIc,
      storyteller: false,
      password: hashedPassword,
      secret: '', // Erase the secret, only valid once
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateInitialUserService;
