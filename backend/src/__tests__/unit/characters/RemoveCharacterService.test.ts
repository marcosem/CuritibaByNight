import 'reflect-metadata';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
// import FakeImageClipperProvider from '@shared/container/providers/ImageClipperProvider/fakes/FakeImageClipperProvider';
import RemoveCharacterService from '@modules/characters/services/RemoveCharacterService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let fakeCharactersRepository: FakeCharactersRepository;
// let fakeImageClipperProvider: FakeImageClipperProvider;
let removeCharacter: RemoveCharacterService;

describe('RemoveCharacter', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    fakeCharactersRepository = new FakeCharactersRepository();

    removeCharacter = new RemoveCharacterService(
      fakeCharactersRepository,
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('Should be able to remove a character', async () => {
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
    });

    const initialListSize = await fakeCharactersRepository.listAll();

    await removeCharacter.execute({
      user_id: stUser.id,
      character_id: char.id,
    });

    const finalListSize = await fakeCharactersRepository.listAll();
    const findChar = await fakeCharactersRepository.findById(char.id);
    expect(finalListSize.length).toEqual(initialListSize.length - 1);
    expect(findChar).toBeUndefined();
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
