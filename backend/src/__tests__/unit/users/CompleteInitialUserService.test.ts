import 'reflect-metadata';
import { uuid } from 'uuidv4';
import CreateInitialUser from '@modules/users/services/CreateInitialUserService';
import CompleteInitialUser from '@modules/users/services/CompleteInitialUserService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
// import AppError from '@shared/errors/AppError';

describe('CompleteInitialUser', () => {
  it('Should be able to get a just created Initial User', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createInitialUser = new CreateInitialUser(fakeUsersRepository);
    const completeInitialUser = new CompleteInitialUser(fakeUsersRepository);

    const initialUser = await createInitialUser.execute({
      name: 'A User',
      email: 'user@user.com',
      email_ic: '',
      phone: '12-12345-1234',
    });

    const initialUserSecret = initialUser.secret;

    const completeUserRetrieved = await completeInitialUser.execute({
      name: 'Anothe Name',
      email: 'other@email.com',
      email_ic: '',
      phone: '21-54321-4321',
      password: '123456',
      secret: initialUserSecret,
    });

    expect(completeUserRetrieved.id).toBe(initialUser.id);
    expect(completeUserRetrieved.secret).toBe('');
    expect(completeUserRetrieved.storyteller).toBeFalsy();
  });

  it('Should return error for not existant secret', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const completeInitialUser = new CompleteInitialUser(fakeUsersRepository);

    await expect(
      completeInitialUser.execute({
        name: 'Anothe Name',
        email: 'other@email.com',
        email_ic: '',
        phone: '21-54321-4321',
        password: '123456',
        secret: uuid(),
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should return error for invalid secret', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const completeInitialUser = new CompleteInitialUser(fakeUsersRepository);

    await expect(
      completeInitialUser.execute({
        name: 'Anothe Name',
        email: 'other@email.com',
        email_ic: '',
        phone: '21-54321-4321',
        password: '123456',
        secret: 'I am not an UUID secret',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should set email_ic to empty if it is equal to email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createInitialUser = new CreateInitialUser(fakeUsersRepository);
    const completeInitialUser = new CompleteInitialUser(fakeUsersRepository);

    const initialUser = await createInitialUser.execute({
      name: 'A User',
      email: 'user@user.com',
      email_ic: '',
      phone: '12-12345-1234',
    });

    const initialUserSecret = initialUser.secret;

    const completeUserRetrieved = await completeInitialUser.execute({
      name: 'Anothe Name',
      email: 'other@email.com',
      email_ic: 'other@email.com',
      phone: '21-54321-4321',
      password: '123456',
      secret: initialUserSecret,
    });

    expect(completeUserRetrieved.email_ic).toBe('');
  });

  it('Should allow email_ic to be different of email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createInitialUser = new CreateInitialUser(fakeUsersRepository);
    const completeInitialUser = new CompleteInitialUser(fakeUsersRepository);

    const initialUser = await createInitialUser.execute({
      name: 'A User',
      email: 'user@user.com',
      email_ic: '',
      phone: '12-12345-1234',
    });

    const initialUserSecret = initialUser.secret;

    const completeUserRetrieved = await completeInitialUser.execute({
      name: 'Anothe Name',
      email: 'email@user.com',
      email_ic: 'email_ic@user.com',
      phone: '21-54321-4321',
      password: '123456',
      secret: initialUserSecret,
    });

    expect(completeUserRetrieved.email).toBe('email@user.com');
    expect(completeUserRetrieved.email_ic).toBe('email_ic@user.com');
  });
});
