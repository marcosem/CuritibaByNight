import 'reflect-metadata';
import { uuid } from 'uuidv4';
import CreateSTUserService from '@modules/users/services/CreateSTUserService';
import GetUserService from '@modules/users/services/GetUserService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';

describe('GetUser', () => {
  it('Should be able to get an user data', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createSTUser = new CreateSTUserService(fakeUsersRepository);
    const getUser = new GetUserService(fakeUsersRepository);

    const user = await createSTUser.execute({
      name: 'A User',
      email: 'user@user.com',
      email_ic: '',
      password: '123456',
      phone: '12-12345-1234',
      st_secret: 'GimmeThePower!',
    });

    const userRetrieved = await getUser.execute(user.id);

    expect(userRetrieved).toMatchObject(user);
  });

  it('Should retunr error when not found an user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    // const createSTUser = new CreateSTUserService(fakeUsersRepository);
    const getUser = new GetUserService(fakeUsersRepository);

    await expect(getUser.execute(uuid())).rejects.toBeInstanceOf(AppError);
  });
});
