import 'reflect-metadata';
import { isUuid } from 'uuidv4';
import CreateSTUserService from '@modules/users/services/CreateSTUserService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';

describe('CreateSTUser', () => {
  it('Should be able to create a new Storyteller User', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createSTUser = new CreateSTUserService(fakeUsersRepository);

    const user = await createSTUser.execute({
      name: 'A User',
      email: 'user@user.com',
      email_ic: '',
      password: '123456',
      phone: '12-12345-1234',
      st_secret: 'GimmeThePower!',
    });

    expect(user).toHaveProperty('id');
    expect(isUuid(user.id)).toBeTruthy();
  });

  it('Should not allow create Storyteller User without the correct secret', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createSTUser = new CreateSTUserService(fakeUsersRepository);

    await expect(
      createSTUser.execute({
        name: 'A User',
        email: 'user@user.com',
        email_ic: '',
        password: '123456',
        phone: '12-12345-1234',
        st_secret: 'Incorrect Secret',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow create two Storyteller Users with same email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createSTUser = new CreateSTUserService(fakeUsersRepository);

    await createSTUser.execute({
      name: 'User One',
      email: 'user@user.com',
      email_ic: '',
      password: '123456',
      phone: '12-12345-1234',
      st_secret: 'GimmeThePower!',
    });

    await expect(
      createSTUser.execute({
        name: 'User Two',
        email: 'user@user.com',
        email_ic: '',
        password: '123456',
        phone: '12-12345-1234',
        st_secret: 'GimmeThePower!',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should set email_ic to empty if it is equal to email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createSTUser = new CreateSTUserService(fakeUsersRepository);

    const user = await createSTUser.execute({
      name: 'User One',
      email: 'user@user.com',
      email_ic: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
      st_secret: 'GimmeThePower!',
    });

    expect(user.email_ic).toBe('');
  });

  it('Should allow email_ic to be different of email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createSTUser = new CreateSTUserService(fakeUsersRepository);

    const user = await createSTUser.execute({
      name: 'User One',
      email: 'email@user.com',
      email_ic: 'email_ic@user.com',
      password: '123456',
      phone: '12-12345-1234',
      st_secret: 'GimmeThePower!',
    });

    expect(user.email).toBe('email@user.com');
    expect(user.email_ic).toBe('email_ic@user.com');
  });
});
