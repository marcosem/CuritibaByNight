import 'reflect-metadata';
import { isUuid } from 'uuidv4';
import CreateInitialUser from '@modules/users/services/CreateInitialUserService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';

describe('CreateInitialUser', () => {
  it('Should be able to create a new Initial User', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createInitialUser = new CreateInitialUser(fakeUsersRepository);

    const user = await createInitialUser.execute({
      name: 'A User',
      email: 'user@user.com',
      email_ic: '',
      phone: '12-12345-1234',
    });

    expect(user).toHaveProperty('id');
    expect(isUuid(user.id)).toBeTruthy();
    expect(user).toHaveProperty('secret');
    expect(isUuid(user.secret)).toBeTruthy();
  });

  it('Should not allow create Initial User with an already existant email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createInitialUser = new CreateInitialUser(fakeUsersRepository);

    await createInitialUser.execute({
      name: 'A User',
      email: 'user@user.com',
      email_ic: '',
      phone: '12-12345-1234',
    });

    await expect(
      createInitialUser.execute({
        name: 'A User',
        email: 'user@user.com',
        email_ic: '',
        phone: '12-12345-1234',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should set email_ic to empty if it is equal to email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createInitialUser = new CreateInitialUser(fakeUsersRepository);

    const user = await createInitialUser.execute({
      name: 'A User',
      email: 'user@user.com',
      email_ic: 'user@user.com',
      phone: '12-12345-1234',
    });

    expect(user.email_ic).toBe('');
  });

  it('Should allow email_ic to be different of email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createInitialUser = new CreateInitialUser(fakeUsersRepository);

    const user = await createInitialUser.execute({
      name: 'A User',
      email: 'email@user.com',
      email_ic: 'email_ic@user.com',
      phone: '12-12345-1234',
    });

    expect(user.email).toBe('email@user.com');
    expect(user.email_ic).toBe('email_ic@user.com');
  });
});
