import { getRepository, Repository } from 'typeorm';
import IUserRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
// import IUpdateUserDTO from '@modules/users/dtos/IUpdateUserDTO';

class UsersRepository implements IUserRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findById(user_id: string): Promise<User | undefined> {
    const userFound = await this.ormRepository.findOne({
      where: { id: user_id },
    });

    // if not found, return undefined
    return userFound;
  }

  // Verify if user Login exist
  public async findBySecret(secret: string): Promise<User | undefined> {
    const userFound = await this.ormRepository.findOne({
      where: { secret },
    });

    // if not found, return undefined
    return userFound;
  }

  // Verify if user Login exist
  public async findByEmail(email: string): Promise<User | undefined> {
    const userFound = await this.ormRepository.findOne({
      where: { email },
    });

    // if not found, return undefined
    return userFound;
  }

  public async create({
    name,
    email,
    email_ic = '',
    phone = '',
    password = undefined,
    storyteller = false,
    secret = undefined,
  }: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({
      name,
      email,
      email_ic,
      phone,
      password,
      storyteller,
      secret,
    });

    await this.ormRepository.save(user);

    return user;
  }

  public async update(user: User): Promise<User> {
    await this.ormRepository.save(user);

    return user;
  }
}

export default UsersRepository;

/*
export default interface IUpdateUserDTO {
  id: string;
  name: string;
  email: string;
  email_ic?: string;
  phone?: string;
  password?: string;
  storyteller?: boolean;
  secret?: string;
  avatar?: string;
  lastLogin_at?: Date;
}
*/
