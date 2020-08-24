import { getCustomRepository } from 'typeorm';
import { uuid } from 'uuidv4';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import UsersRepository from '@modules/users/repositories/UsersRepository';

interface RequestDTO {
  name: string;
  email: string;
  email_ic: string;
  phone: string;
}

class CreateInitialUserService {
  public async execute({
    name,
    email,
    email_ic,
    phone,
  }: RequestDTO): Promise<User> {
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

    // const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      phone,
      email_ic: redefEmailIc,
      storyteller: false,
      secret: uuid(),
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateInitialUserService;
