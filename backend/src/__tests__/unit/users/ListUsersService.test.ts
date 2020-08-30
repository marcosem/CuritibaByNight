import 'reflect-metadata';
import CreateSTUserService from '@modules/users/services/CreateSTUserService';
import ListUsersService from '@modules/users/services/ListUsersService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

describe('ListUsers', () => {
  it('Should be able to get an user data', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createSTUser = new CreateSTUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const listUsers = new ListUsersService(fakeUsersRepository);

    await createSTUser.execute({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
      st_secret: 'GimmeThePower!',
    });

    await createSTUser.execute({
      name: 'Another User',
      email: 'anotheruser@user.com',
      password: '123456',
      phone: '12-12345-1234',
      st_secret: 'GimmeThePower!',
    });

    const userList = await listUsers.execute();

    expect(userList).toHaveLength(2);
  });
});
