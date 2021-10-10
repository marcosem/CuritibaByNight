import 'reflect-metadata';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeImageClipperProvider from '@shared/container/providers/ImageClipperProvider/fakes/FakeImageClipperProvider';
import RemoveUserService from '@modules/users/services/RemoveUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let fakeImageClipperProvider: FakeImageClipperProvider;
let removeUserService: RemoveUserService;
let updateUserAvatar: UpdateUserAvatarService;

describe('RemoveUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    removeUserService = new RemoveUserService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('Should be able to delete his own user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: false,
    });

    await removeUserService.execute({ user_id: user.id });

    const listLength = await fakeUsersRepository.listAll();
    expect(listLength).toHaveLength(0);
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

    const listLength = await fakeUsersRepository.listAll();
    expect(listLength).toHaveLength(1);

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

  it('Should delete avatar file when removing an user', async () => {
    fakeImageClipperProvider = new FakeImageClipperProvider();
    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
      fakeImageClipperProvider,
    );

    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: false,
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarPath: '/does not matter',
      avatarFilename: 'avatar.jpg',
    });

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    await removeUserService.execute({ user_id: user.id });
    const listLength = await fakeUsersRepository.listAll();

    expect(listLength).toHaveLength(0);
    expect(deleteFile).toBeCalledWith('avatar.jpg', 'avatar');
  });
});
