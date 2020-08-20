import { getCustomRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/User';
import UsersRepository from '../repositories/UsersRepository';
import AppError from '../errors/AppError';

interface RequestDTO {
  name: string;
  email: string;
  email_ic: string;
  phone: string;
  password: string;
  st_secret: string;
}

class CreateSTUserService {
  public async execute({
    name,
    email,
    email_ic,
    phone,
    password,
    st_secret,
  }: RequestDTO): Promise<User> {
    if (st_secret !== 'GimmeThePower!') {
      throw new AppError('User not authorized.', 401);
    }

    const usersRepository = getCustomRepository(UsersRepository);

    // Verify is user email already exist
    const userEmailExist = await usersRepository.findUserByEmail(email);
    if (userEmailExist) {
      throw new AppError('Email address already exist.', 409);
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
      name,
      email,
      phone,
      email_ic: redefEmailIc,
      storyteller: true,
      password: hashedPassword,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateSTUserService;