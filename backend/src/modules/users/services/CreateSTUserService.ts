import { hash } from 'bcryptjs';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUserRepository from '@modules/users/repositories/IUsersRepository';

interface IRequestDTO {
  name: string;
  email: string;
  email_ic: string;
  phone: string;
  password: string;
  st_secret: string;
}

class CreateSTUserService {
  constructor(private usersRepository: IUserRepository) {}

  public async execute({
    name,
    email,
    email_ic,
    phone,
    password,
    st_secret,
  }: IRequestDTO): Promise<User> {
    if (st_secret !== 'GimmeThePower!') {
      throw new AppError('User not authorized.', 401);
    }

    // Verify is user email already exist
    const userEmailExist = await this.usersRepository.findByEmail(email);
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

    const user = await this.usersRepository.create({
      name,
      email,
      phone,
      email_ic: redefEmailIc,
      storyteller: true,
      password: hashedPassword,
    });

    return user;
  }
}

export default CreateSTUserService;
