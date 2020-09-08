import 'reflect-metadata';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateCharacterAvatarService from '@modules/characters/services/UpdateCharacterAvatarService';
import AppError from '@shared/errors/AppError';

let fakeCharactersRepository: FakeCharactersRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateCharacterAvatar: UpdateCharacterAvatarService;

describe('updateCharacterAvatar', () => {
  beforeEach(() => {
    fakeCharactersRepository = new FakeCharactersRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateCharacterAvatar = new UpdateCharacterAvatarService(
      fakeCharactersRepository,
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('Should be able to update the character avatar', async () => {
    // Create a user
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
    });

    const char = await fakeCharactersRepository.create({
      user_id: user.id,
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
      email: 'dracula@vampyr.com',
    });

    const charWithAvatar = await updateCharacterAvatar.execute({
      user_id: user.id,
      char_id: char.id,
      avatarFilename: 'avatar.jpg',
    });

    expect(charWithAvatar).toHaveProperty('avatar', 'avatar.jpg');
  });

  it('Should delete old avatar before add new', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
    });

    const char = await fakeCharactersRepository.create({
      user_id: user.id,
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
      email: 'dracula@vampyr.com',
    });

    await updateCharacterAvatar.execute({
      user_id: user.id,
      char_id: char.id,
      avatarFilename: 'avatar.jpg',
    });

    const charWithAvatar = await updateCharacterAvatar.execute({
      user_id: user.id,
      char_id: char.id,
      avatarFilename: 'new_avatar.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg', 'avatar');
    expect(charWithAvatar).toHaveProperty('avatar', 'new_avatar.jpg');
  });

  it('Should not allow to update avatar for invalid users', async () => {
    await expect(
      updateCharacterAvatar.execute({
        user_id: 'Invalid User',
        char_id: 'Do not matter',
        avatarFilename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow to update avatar for invalid characters', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
    });

    await expect(
      updateCharacterAvatar.execute({
        user_id: user.id,
        char_id: 'Do not matter',
        avatarFilename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow to update character avatar for others users', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
    });

    const char = await fakeCharactersRepository.create({
      user_id: user.id,
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
      email: 'dracula@vampyr.com',
    });

    const notOwnerUser = await fakeUsersRepository.create({
      name: 'I am not the owner',
      email: 'notownwe@user.com',
      password: '123456',
      phone: '12-12345-1234',
    });

    await expect(
      updateCharacterAvatar.execute({
        user_id: notOwnerUser.id,
        char_id: char.id,
        avatarFilename: 'avatar.jpg',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});
