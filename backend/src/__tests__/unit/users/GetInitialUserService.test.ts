import 'reflect-metadata';
import { uuid } from 'uuidv4';
import CreateInitialUser from '@modules/users/services/CreateInitialUserService';
import GetInitialUser from '@modules/users/services/GetInitialUserService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let getInitialUser: GetInitialUser;

describe('GetInitialUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    getInitialUser = new GetInitialUser(fakeUsersRepository);
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

    const intialUserRetrieved = await getInitialUser.execute({
      secret: initialUserSecret,
    });

    expect(intialUserRetrieved).toMatchObject(initialUser);
  });

  it('Should return error for not existant secret', async () => {
    await expect(
      getInitialUser.execute({ secret: uuid() }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should return error for invalid secret', async () => {
    await expect(
      getInitialUser.execute({ secret: 'I am not an UUID secret' }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});
