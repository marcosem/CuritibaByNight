import 'reflect-metadata';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import RemoveUserService from '@modules/users/services/RemoveUserService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let removeUserService: RemoveUserService;

describe('RemoveUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    removeUserService = new RemoveUserService(fakeUsersRepository);
  });

  it('Should be to delete his own user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: false,
    });

    await removeUserService.execute({ user_id: user.id });

    const listLenght = await fakeUsersRepository.listAll();
    expect(listLenght).toHaveLength(0);
  });

  it('Should not allow remove an invalid user', async () => {
    await expect(
      removeUserService.execute({ user_id: 'I do not exist' }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow non storyteller to delete another user', async () => {
    const notSTUser = await fakeUsersRepository.create({
      name: 'I am not ST',
      email: 'user@user.com',
      password: '123456',
      storyteller: false,
    });

    const anotherUser = await fakeUsersRepository.create({
      name: 'Another User',
      email: 'anotheruser@user.com',
      password: '123456',
      storyteller: false,
    });

    await expect(
      removeUserService.execute({
        user_id: notSTUser.id,
        profile_id: anotherUser.id,
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should allow storyteller to delete another user', async () => {
    const stUser = await fakeUsersRepository.create({
      name: 'I am ST',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const anotherUser = await fakeUsersRepository.create({
      name: 'Another User',
      email: 'anotheruser@user.com',
      password: '123456',
      storyteller: false,
    });

    await removeUserService.execute({
      user_id: stUser.id,
      profile_id: anotherUser.id,
    });

    const listLenght = await fakeUsersRepository.listAll();
    expect(listLenght).toHaveLength(1);

    const lastUser = await fakeUsersRepository.findById(stUser.id);
    expect(lastUser).toMatchObject(stUser);
  });

  it('Should not allow to delete a non existant user', async () => {
    const stUser = await fakeUsersRepository.create({
      name: 'I am ST',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      removeUserService.execute({
        user_id: stUser.id,
        profile_id: 'I do not exist',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
