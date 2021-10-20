import 'reflect-metadata';
import { v4 } from 'uuid';
import { isToday } from 'date-fns';
import CreateInitialUser from '@modules/users/services/CreateInitialUserService';
import CompleteInitialUser from '@modules/users/services/CompleteInitialUserService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeMailProvider: FakeMailProvider;
let completeInitialUser: CompleteInitialUser;

describe('CompleteInitialUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    completeInitialUser = new CompleteInitialUser(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('Should be able to get a just created Initial User', async () => {
    fakeMailProvider = new FakeMailProvider();
    const createInitialUser = new CreateInitialUser(
      fakeUsersRepository,
      fakeMailProvider,
    );

    const initialUser = await createInitialUser.execute({
      name: 'A User',
      email: 'user@user.com',
      phone: '12-12345-1234',
    });

    const initialUserSecret = initialUser.secret;

    const completeUserRetrieved = await completeInitialUser.execute({
      name: 'Another Name',
      email: 'other@email.com',
      phone: '21-54321-4321',
      password: '123456',
      secret: initialUserSecret,
    });

    expect(completeUserRetrieved.id).toBe(initialUser.id);
    expect(completeUserRetrieved.secret).toBe('');
    expect(completeUserRetrieved.storyteller).toBeFalsy();
  });

  it('Should be able to complete Initial User with LGPD acceptance', async () => {
    fakeMailProvider = new FakeMailProvider();
    const createInitialUser = new CreateInitialUser(
      fakeUsersRepository,
      fakeMailProvider,
    );

    const initialUser = await createInitialUser.execute({
      name: 'A User',
      email: 'user@user.com',
      phone: '12-12345-1234',
    });

    const initialUserSecret = initialUser.secret;

    const completeUserRetrieved = await completeInitialUser.execute({
      name: 'Another Name',
      email: 'other@email.com',
      phone: '21-54321-4321',
      password: '123456',
      secret: initialUserSecret,
      lgpd_acceptance: true,
    });

    expect(completeUserRetrieved.id).toBe(initialUser.id);
    expect(completeUserRetrieved.secret).toBe('');
    expect(completeUserRetrieved.storyteller).toBeFalsy();
    expect(completeUserRetrieved.lgpd_denial_date).toEqual(null);
    expect(completeUserRetrieved.lgpd_acceptance_date).not.toEqual(null);
    if (completeUserRetrieved.lgpd_acceptance_date !== null) {
      expect(isToday(completeUserRetrieved.lgpd_acceptance_date)).toBeTruthy();
    }
  });

  it('Should be able to complete Initial User deny LGPD acceptance', async () => {
    fakeMailProvider = new FakeMailProvider();
    const createInitialUser = new CreateInitialUser(
      fakeUsersRepository,
      fakeMailProvider,
    );

    const initialUser = await createInitialUser.execute({
      name: 'A User',
      email: 'user@user.com',
      phone: '12-12345-1234',
    });

    const initialUserSecret = initialUser.secret;

    const completeUserRetrieved = await completeInitialUser.execute({
      name: 'Another Name',
      email: 'other@email.com',
      phone: '21-54321-4321',
      password: '123456',
      secret: initialUserSecret,
      lgpd_acceptance: false,
    });

    expect(completeUserRetrieved.id).toBe(initialUser.id);
    expect(completeUserRetrieved.secret).toBe('');
    expect(completeUserRetrieved.storyteller).toBeFalsy();
    expect(completeUserRetrieved.lgpd_acceptance_date).toEqual(null);
    expect(completeUserRetrieved.lgpd_denial_date).not.toEqual(null);
    if (completeUserRetrieved.lgpd_denial_date !== null) {
      expect(isToday(completeUserRetrieved.lgpd_denial_date)).toBeTruthy();
    }
  });

  it('Should return error for not existant secret', async () => {
    await expect(
      completeInitialUser.execute({
        name: 'Another Name',
        email: 'other@email.com',
        phone: '21-54321-4321',
        password: '123456',
        secret: v4(),
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should return error for invalid secret', async () => {
    await expect(
      completeInitialUser.execute({
        name: 'Another Name',
        email: 'other@email.com',
        phone: '21-54321-4321',
        password: '123456',
        secret: 'I am not an UUID secret',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});
