import 'reflect-metadata';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
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
      avatarFilename: 'avatar.jpg',
    });

    const userWithAvatar = await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'new_avatar.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg', 'avatar');
    expect(userWithAvatar).toHaveProperty('avatar', 'new_avatar.jpg');
  });

  it('Should not allow to update avatar for invalid users', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'Non Existant User',
        avatarFilename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
