import IUserRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import { uuid } from 'uuidv4';

class UsersRepository implements IUserRepository {
  private users: User[] = [];

  public async findById(user_id: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.id === user_id);

    return findUser;
  }

  // Verify if user Login exist
  public async findBySecret(secret: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.secret === secret);

    return findUser;
  }

  // Verify if user Login exist
  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.email === email);

    return findUser;
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
    const user = new User();

    Object.assign(user, {
      id: uuid(),
      name,
      email,
      email_ic,
      phone,
      storyteller,
    });

    if (password) {
      user.password = password;
    }

    if (secret) {
      user.secret = secret;
    }

    this.users.push(user);

    return user;
  }

  public async update(user: User): Promise<User> {
    this.users = this.users.map(oldUser =>
      oldUser.id !== user.id ? oldUser : user,
    );

    return user;
  }

  public async listAll(): Promise<User[]> {
    return this.users;
  }
}

export default UsersRepository;

/*
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

  public async update(user: User): Promise<User> {
    await this.ormRepository.save(user);

    return user;
  }

}

export default UsersRepository;

*/
