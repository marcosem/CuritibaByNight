import 'reflect-metadata';
import { uuid } from 'uuidv4';
import CreateSTUserService from '@modules/users/services/CreateSTUserService';
import GetUserService from '@modules/users/services/GetUserService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';

describe('GetUser', () => {
  it('Should be able to get an user data', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createSTUser = new CreateSTUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const getUser = new GetUserService(fakeUsersRepository);

    const user = await createSTUser.execute({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
      st_secret: 'GimmeThePower!',
    });

    const userRetrieved = await getUser.execute(user.id);

    expect(userRetrieved).toMatchObject(user);
  });

  it('Should return error when not found an user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const getUser = new GetUserService(fakeUsersRepository);

    await expect(getUser.execute(uuid())).rejects.toBeInstanceOf(AppError);
  });
});
