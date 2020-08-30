import { injectable, inject } from 'tsyringe';
import { uuid } from 'uuidv4';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequestDTO {
  name: string;
  email: string;
  phone: string;
}

@injectable()
class CreateInitialUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ name, email, phone }: IRequestDTO): Promise<User> {
    // Verify is user email already exist
    const userEmailExist = await this.usersRepository.findByEmail(email);
    if (userEmailExist) {
      throw new AppError('Email address already exist.', 409);
    }

    const user = await this.usersRepository.create({
      name,
      email,
      phone,
      storyteller: false,
      secret: uuid(),
    });

    return user;
  }
}

export default CreateInitialUserService;
