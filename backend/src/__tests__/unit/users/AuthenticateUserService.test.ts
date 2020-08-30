import 'reflect-metadata';
import CreateSTUserService from '@modules/users/services/CreateSTUserService';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

describe('AuthenticateUser', () => {
  const fakeUsersRepository = new FakeUsersRepository();

  beforeAll(async () => {
    const fakeHashProvider = new FakeHashProvider();
    const createSTUser = new CreateSTUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createSTUser.execute({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
      st_secret: 'GimmeThePower!',
    });
  });

  it('Should be to able to authenticate', async () => {
    const fakeHashProvider = new FakeHashProvider();
    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const response = await authenticateUser.execute({
      email: 'user@user.com',
      password: '123456',
    });

    expect(response).toHaveProperty('user');
    expect(response).toHaveProperty('token');
  });

  it('Should not allow to autheticate a non existant email', async () => {
    const fakeHashProvider = new FakeHashProvider();
    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await expect(
      authenticateUser.execute({
        email: 'IdontExist@user.com',
        password: '123456',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow to autheticate with wrong password', async () => {
    const fakeHashProvider = new FakeHashProvider();
    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await expect(
      authenticateUser.execute({
        email: 'user@user.com',
        password: 'wrongPassword',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});
