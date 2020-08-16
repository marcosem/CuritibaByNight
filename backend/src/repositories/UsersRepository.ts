import { EntityRepository, Repository } from 'typeorm';
import User from '../models/User';

@EntityRepository(User)
class UsersRepository extends Repository<User> {
  // Verify if user Login exist
  public async findUserByLogin(login: string): Promise<User | null> {
    const userFound = await this.findOne({
      where: { login },
    });

    // if not found, return null
    return userFound || null;
  }

  // Verify if user Login exist
  public async findUserByEmail(email: string): Promise<User | null> {
    const userFound = await this.findOne({
      where: { email },
    });

    // if not found, return null
    return userFound || null;
  }
}

export default UsersRepository;
