import { EntityRepository, Repository } from 'typeorm';
import IUserRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';

@EntityRepository(User)
class UsersRepository extends Repository<User> implements IUserRepository {
  // Verify if user Login exist
  public async findUserBySecret(secret: string): Promise<User | undefined> {
    const userFound = await this.findOne({
      where: { secret },
    });

    // if not found, return undefined
    return userFound;
  }

  // Verify if user Login exist
  public async findUserByEmail(email: string): Promise<User | undefined> {
    const userFound = await this.findOne({
      where: { email },
    });

    // if not found, return undefined
    return userFound;
  }
}

export default UsersRepository;
