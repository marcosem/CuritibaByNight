import 'reflect-metadata';
import { uuid } from 'uuidv4';
import GetUserService from '@modules/users/services/GetUserService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let getUser: GetUserService;

describe('GetUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    getUser = new GetUserService(fakeUsersRepository);
  });

  it('Should be able to get an user data', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
    });

    const userRetrieved = await getUser.execute(user.id);

    expect(userRetrieved).toMatchObject(user);
  });

  it('Should return error when not found an user', async () => {
    await expect(getUser.execute(uuid())).rejects.toBeInstanceOf(AppError);
  });
});
