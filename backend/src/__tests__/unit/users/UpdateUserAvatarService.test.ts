import 'reflect-metadata';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeImageClipperProvider from '@shared/container/providers/ImageClipperProvider/fakes/FakeImageClipperProvider';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let fakeImageClipperProvider: FakeImageClipperProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    fakeImageClipperProvider = new FakeImageClipperProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
      fakeImageClipperProvider,
    );
  });

  it('Should be able to update the user avatar', async () => {
    // Create a user
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
    });

    const userWithAvatar = await updateUserAvatar.execute({
      user_id: user.id,
      avatarPath: '/does not matter',
      avatarFilename: 'avatar.jpg',
    });

    expect(userWithAvatar).toHaveProperty('avatar', 'avatar.jpg');
  });

  it('Should delete old avatar before add new', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    // Create a user
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarPath: '/does not matter',
      avatarFilename: 'avatar.jpg',
    });

    const userWithAvatar = await updateUserAvatar.execute({
      user_id: user.id,
      avatarPath: '/does not matter',
      avatarFilename: 'new_avatar.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg', 'avatar');
    expect(userWithAvatar).toHaveProperty('avatar', 'new_avatar.jpg');
  });

  it('Should not allow to update avatar for invalid users', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'Non Existant User',
        avatarPath: '/does not matter',
        avatarFilename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should use the adjusted avatar file when have some adjust', async () => {
    // Create a user
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
    });

    jest
      .spyOn(fakeImageClipperProvider, 'cropImage')
      .mockImplementationOnce(async file => {
        return `different_${file}`;
      });

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const userWithAvatar = await updateUserAvatar.execute({
      user_id: user.id,
      avatarPath: '/does not matter',
      avatarFilename: 'avatar.jpg',
    });

    expect(userWithAvatar).toHaveProperty('avatar', 'different_avatar.jpg');
    expect(deleteFile).toBeCalledWith('avatar.jpg', '');
  });
});
