import { injectable, inject } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

interface IRequestDTO {
  name: string;
  email: string;
  phone: string;
  password: string;
  st_secret: string;
}

@injectable()
class CreateSTUserService {
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

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      phone,
      storyteller: true,
      password: hashedPassword,
    });

    return user;
  }
}

export default CreateSTUserService;
