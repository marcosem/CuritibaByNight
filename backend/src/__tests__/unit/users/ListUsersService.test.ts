import 'reflect-metadata';
import ListUsersService from '@modules/users/services/ListUsersService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

describe('ListUsers', () => {
  it('Should be able to get an user data', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const listUsers = new ListUsersService(fakeUsersRepository);

    await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
    });

    await fakeUsersRepository.create({
      name: 'Another User',
      email: 'anotheruser@user.com',
      password: '123456',
      phone: '12-12345-1234',
    });

    const userList = await listUsers.execute();

    expect(userList).toHaveLength(2);
  });
});
