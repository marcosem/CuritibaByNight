import 'reflect-metadata';
import { uuid } from 'uuidv4';
import CreateInitialUser from '@modules/users/services/CreateInitialUserService';
import CompleteInitialUser from '@modules/users/services/CompleteInitialUserService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
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
    const createInitialUser = new CreateInitialUser(fakeUsersRepository);

    const initialUser = await createInitialUser.execute({
      name: 'A User',
      email: 'user@user.com',
      phone: '12-12345-1234',
    });

    const initialUserSecret = initialUser.secret;

    const completeUserRetrieved = await completeInitialUser.execute({
      name: 'Anothe Name',
      email: 'other@email.com',
      phone: '21-54321-4321',
      password: '123456',
      secret: initialUserSecret,
    });

    expect(completeUserRetrieved.id).toBe(initialUser.id);
    expect(completeUserRetrieved.secret).toBe('');
    expect(completeUserRetrieved.storyteller).toBeFalsy();
  });

  it('Should return error for not existant secret', async () => {
    await expect(
      completeInitialUser.execute({
        name: 'Anothe Name',
        email: 'other@email.com',
        phone: '21-54321-4321',
        password: '123456',
        secret: uuid(),
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should return error for invalid secret', async () => {
    await expect(
      completeInitialUser.execute({
        name: 'Anothe Name',
        email: 'other@email.com',
        phone: '21-54321-4321',
        password: '123456',
        secret: 'I am not an UUID secret',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});
