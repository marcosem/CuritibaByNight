import 'reflect-metadata';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
      storyteller: true,
    });
  });

  it('Should be to able to authenticate', async () => {
    const response = await authenticateUser.execute({
      email: 'user@user.com',
      password: '123456',
    });

    expect(response).toHaveProperty('user');
    expect(response).toHaveProperty('token');
  });

  it('Should not allow to autheticate a non existant email', async () => {
    await expect(
      authenticateUser.execute({
        email: 'IdontExist@user.com',
        password: '123456',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow to autheticate with wrong password', async () => {
    await expect(
      authenticateUser.execute({
        email: 'user@user.com',
        password: 'wrongPassword',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});
