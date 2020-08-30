import 'reflect-metadata';
import { uuid } from 'uuidv4';
import CreateInitialUser from '@modules/users/services/CreateInitialUserService';
import GetInitialUser from '@modules/users/services/GetInitialUserService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
// import AppError from '@shared/errors/AppError';

describe('GetInitialUser', () => {
  it('Should be able to get a just created Initial User', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createInitialUser = new CreateInitialUser(fakeUsersRepository);
    const getInitialUser = new GetInitialUser(fakeUsersRepository);

    const initialUser = await createInitialUser.execute({
      name: 'A User',
      email: 'user@user.com',
      phone: '12-12345-1234',
    });

    const initialUserSecret = initialUser.secret;

    const intialUserRetrieved = await getInitialUser.execute({
      secret: initialUserSecret,
    });

    expect(intialUserRetrieved).toMatchObject(initialUser);
  });

  it('Should return error for not existant secret', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const getInitialUser = new GetInitialUser(fakeUsersRepository);

    await expect(
      getInitialUser.execute({ secret: uuid() }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should return error for invalid secret', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const getInitialUser = new GetInitialUser(fakeUsersRepository);

    await expect(
      getInitialUser.execute({ secret: 'I am not an UUID secret' }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});
