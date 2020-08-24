import User from '@modules/users/infra/typeorm/entities/User';

export default interface IUserRepository {
  // create(): Promise<User>;
  findUserBySecret(secret: string): Promise<User | undefined>;
  findUserByEmail(email: string): Promise<User | undefined>;
}
