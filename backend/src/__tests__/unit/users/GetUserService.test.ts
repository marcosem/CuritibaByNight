import 'reflect-metadata';
import { uuid } from 'uuidv4';
import GetUserService from '@modules/users/services/GetUserService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let getUser: GetUserService;

describe('GetUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    getUser = new GetUserService(fakeUsersRepository);
  });

  it('Should be able to get an user data', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
    });

    const userRetrieved = await getUser.execute({ user_id: user.id });

    expect(userRetrieved).toMatchObject(user);
  });

  it('Should return error when not found an user', async () => {
    await expect(getUser.execute({ user_id: uuid() })).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it('Should not allow non storyteller users to see other users profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
    });

    const anotherUser = await fakeUsersRepository.create({
      name: 'Another User',
      email: 'anotheruser@user.com',
      password: '123456',
      phone: '12-12345-1234',
    });

    await expect(
      getUser.execute({
        user_id: user.id,
        profile_id: anotherUser.id,
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should allow storyteller users to see other users profile', async () => {
    const stUser = await fakeUsersRepository.create({
      name: 'A ST User',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
      storyteller: true,
    });

    const anotherUser = await fakeUsersRepository.create({
      name: 'Another User',
      email: 'anotheruser@user.com',
      password: '123456',
      phone: '12-12345-1234',
    });

    const userProfile = await getUser.execute({
      user_id: stUser.id,
      profile_id: anotherUser.id,
    });

    expect(userProfile).toMatchObject({
      name: 'Another User',
      email: 'anotheruser@user.com',
      password: '123456',
      phone: '12-12345-1234',
    });
  });

  it('Should not allow to see not existant users profile', async () => {
    const stUser = await fakeUsersRepository.create({
      name: 'A ST User',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
      storyteller: true,
    });

    await expect(
      getUser.execute({
        user_id: stUser.id,
        profile_id: 'I do not exist!',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
