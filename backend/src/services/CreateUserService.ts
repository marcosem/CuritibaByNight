import { getCustomRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/User';
import UsersRepository from '../repositories/UsersRepository';
import AppError from '../errors/AppError';

interface RequestDTO {
  name: string;
  login: string;
  email: string;
  email_ic: string;
  phone: string;
  password: string;
}

class CreateUserService {
  public async execute({
    name,
    login,
    email,
    email_ic,
    phone,
    password,
  }: RequestDTO): Promise<User> {
    const usersRepository = getCustomRepository(UsersRepository);

    // Verify if user login already exist
    const userLoginExist = await usersRepository.findUserByLogin(login);
    if (userLoginExist) {
      throw new AppError('User login already exist.', 409);
    }

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
      login,
      email,
      phone,
      email_ic: redefEmailIc,
      storyteller: false,
      password: hashedPassword,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
