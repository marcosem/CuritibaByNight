import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import { v4 } from 'uuid';

class FakeUsersRepository implements IUsersRepository {
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
    phone = '',
    password = undefined,
    storyteller = false,
    secret = undefined,
  }: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, {
      id: v4(),
      name,
      email,
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

  public async delete(user_id: string): Promise<void> {
    const listWithRemovedUsers = this.users.filter(user => user.id !== user_id);
    this.users = listWithRemovedUsers;
  }
}

export default FakeUsersRepository;
