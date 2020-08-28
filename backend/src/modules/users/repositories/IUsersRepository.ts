import User from '@modules/users/infra/typeorm/entities/User';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

export default interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<User>;
  update(data: User): Promise<User>;
  findById(user_id: string): Promise<User | undefined>;
  findBySecret(secret: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  listAll(): Promise<User[]>;
}
