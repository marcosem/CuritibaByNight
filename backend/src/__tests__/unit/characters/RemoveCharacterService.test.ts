import 'reflect-metadata';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeSaveRouteResultProvider from '@shared/container/providers/SaveRouteResultProvider/fakes/FakeSaveRouteResultProvider';
import RemoveCharacterService from '@modules/characters/services/RemoveCharacterService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let fakeCharactersRepository: FakeCharactersRepository;
let fakeSaveRouteResultProvider: FakeSaveRouteResultProvider;
let removeCharacter: RemoveCharacterService;

describe('RemoveCharacter', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    fakeCharactersRepository = new FakeCharactersRepository();
    fakeSaveRouteResultProvider = new FakeSaveRouteResultProvider();

    removeCharacter = new RemoveCharacterService(
      fakeCharactersRepository,
      fakeUsersRepository,
      fakeStorageProvider,
      fakeSaveRouteResultProvider,
    );
  });

  it('Should be able to remove a character', async () => {
    const removeSavedResult = jest.spyOn(fakeSaveRouteResultProvider, 'remove');

    const stUser = await fakeUsersRepository.create({
      name: 'St User',
      email: 'stUser@user.com',
      password: '123456',
      storyteller: true,
    });

    const char = await fakeCharactersRepository.create({
      user_id: stUser.id,
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
      npc: false,
    });

    const initialListSize = await fakeCharactersRepository.listAll();

    await removeCharacter.execute({
      user_id: stUser.id,
      character_id: char.id,
    });

    const finalListSize = await fakeCharactersRepository.listAll();
    const findChar = await fakeCharactersRepository.findById(char.id);
    expect(finalListSize).toHaveLength(initialListSize.length - 1);
    expect(findChar).toBeUndefined();
    expect(removeSavedResult).toHaveBeenCalledWith('CharactersInfluences');
  });

  it('Should delete avatar when removing character', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    // Create a Storyteller user
    const stUser = await fakeUsersRepository.create({
      name: 'St User',
      email: 'stUser@user.com',
      password: '123456',
      storyteller: true,
    });

    const char = await fakeCharactersRepository.create({
      user_id: stUser.id,
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
      npc: false,
    });

    char.avatar = 'avatar.jpg';
    const charWithAvatar = await fakeCharactersRepository.update(char);

    await removeCharacter.execute({
      user_id: stUser.id,
      character_id: charWithAvatar.id,
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg', 'avatar');
  });

  it('Should not allow invalid users to remove a character', async () => {
    await expect(
      removeCharacter.execute({
        user_id: 'I do not exist',
        character_id: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow non storyteller users remove a character', async () => {
    const user = await fakeUsersRepository.create({
      name: 'User',
      email: 'user@user.com',
      password: '123456',
      storyteller: false,
    });

    await expect(
      removeCharacter.execute({
        user_id: user.id,
        character_id: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow remove a non existant character', async () => {
    const stUser = await fakeUsersRepository.create({
      name: 'ST User',
      email: 'stuser@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      removeCharacter.execute({
        user_id: stUser.id,
        character_id: 'I do not exist',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
