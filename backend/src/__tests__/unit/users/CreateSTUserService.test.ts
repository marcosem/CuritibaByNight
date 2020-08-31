import 'reflect-metadata';
import { isUuid } from 'uuidv4';
import CreateSTUserService from '@modules/users/services/CreateSTUserService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createSTUser: CreateSTUserService;

describe('CreateSTUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createSTUser = new CreateSTUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('Should be able to create a new Storyteller User', async () => {
    const user = await createSTUser.execute({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
      st_secret: 'GimmeThePower!',
    });

    expect(user).toHaveProperty('id');
    expect(isUuid(user.id)).toBeTruthy();
  });

  it('Should not allow create Storyteller User without the correct secret', async () => {
    await expect(
      createSTUser.execute({
        name: 'A User',
        email: 'user@user.com',
        password: '123456',
        phone: '12-12345-1234',
        st_secret: 'Incorrect Secret',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow create two Storyteller Users with same email', async () => {
    await createSTUser.execute({
      name: 'User One',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
      st_secret: 'GimmeThePower!',
    });

    await expect(
      createSTUser.execute({
        name: 'User Two',
        email: 'user@user.com',
        password: '123456',
        phone: '12-12345-1234',
        st_secret: 'GimmeThePower!',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
