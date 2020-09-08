import 'reflect-metadata';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import CreateCharacterSheetService from '@modules/characters/services/CreateCharacterSheetService';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let fakeCharactersRepository: FakeCharactersRepository;
let createCharacterSheet: CreateCharacterSheetService;

describe('CreateCharacterSheet', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    fakeCharactersRepository = new FakeCharactersRepository();

    createCharacterSheet = new CreateCharacterSheetService(
      fakeCharactersRepository,
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('Should be able to create a character sheet to an user', async () => {
    // Create a user
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const char = await createCharacterSheet.execute({
      user_id: user.id,
      player_id: user.id,
      char_name: 'Dracula',
      char_xp: 666,
      char_clan: 'Tzimisce',
      sheetFilename: 'dracula.pdf',
      char_email: 'dracula@vampyr.com',
    });

    expect(char).toHaveProperty('id');
    expect(char).toMatchObject({
      user_id: user.id,
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
      email: 'dracula@vampyr.com',
    });
  });

  it('Should not allow not existant user to create character sheets', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    await expect(
      createCharacterSheet.execute({
        user_id: 'I am invalid',
        player_id: 'Does not matter',
        char_name: 'Dracula',
        char_xp: 666,
        char_clan: 'Tzimisce',
        sheetFilename: 'dracula.pdf',
        char_email: 'dracula@vampyr.com',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });

    expect(deleteFile).toHaveBeenCalledWith('dracula.pdf', 'sheet');
  });

  it('Should not allow non storyteller user to create character sheets', async () => {
    // Create a user
    const noSTUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
    });

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    await expect(
      createCharacterSheet.execute({
        user_id: noSTUser.id,
        player_id: 'Does not matter',
        char_name: 'Dracula',
        char_xp: 666,
        char_clan: 'Tzimisce',
        sheetFilename: 'dracula.pdf',
        char_email: 'dracula@vampyr.com',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });

    expect(deleteFile).toHaveBeenCalledWith('dracula.pdf', 'sheet');
  });

  it('Should not allow to create character sheets with a non PDF file', async () => {
    // Create a user
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    await expect(
      createCharacterSheet.execute({
        user_id: user.id,
        player_id: user.id,
        char_name: 'Dracula',
        char_xp: 666,
        char_clan: 'Tzimisce',
        sheetFilename: 'dracula.jpg',
        char_email: 'dracula@vampyr.com',
      }),
    ).rejects.toBeInstanceOf(AppError);

    expect(deleteFile).toHaveBeenCalledWith('dracula.jpg', 'sheet');
  });

  it('Should not allow to create character sheets for non existant users', async () => {
    // Create a user
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    await expect(
      createCharacterSheet.execute({
        user_id: user.id,
        player_id: 'I do not exist',
        char_name: 'Dracula',
        char_xp: 666,
        char_clan: 'Tzimisce',
        sheetFilename: 'dracula.pdf',
        char_email: 'dracula@vampyr.com',
      }),
    ).rejects.toBeInstanceOf(AppError);

    expect(deleteFile).toHaveBeenCalledWith('dracula.pdf', 'sheet');
  });
});
