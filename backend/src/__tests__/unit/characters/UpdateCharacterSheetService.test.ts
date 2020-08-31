import 'reflect-metadata';
import CreateSTUserService from '@modules/users/services/CreateSTUserService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import CreateCharacterSheetService from '@modules/characters/services/CreateCharacterSheetService';
import UpdateCharacterSheetService from '@modules/characters/services/UpdateCharacterSheetService';
import CreateInitialUser from '@modules/users/services/CreateInitialUserService';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import AppError from '@shared/errors/AppError';
import Character from '@modules/characters/infra/typeorm/entities/Character';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let fakeCharactersRepository: FakeCharactersRepository;
let fakeHashProvider: FakeHashProvider;
let createSTUser: CreateSTUserService;
let createCharacterSheet: CreateCharacterSheetService;
let updateCharacterSheet: UpdateCharacterSheetService;

describe('UpdateCharacterSheet', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    fakeCharactersRepository = new FakeCharactersRepository();
    fakeHashProvider = new FakeHashProvider();

    createSTUser = new CreateSTUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    createCharacterSheet = new CreateCharacterSheetService(
      fakeCharactersRepository,
      fakeUsersRepository,
      fakeStorageProvider,
    );

    updateCharacterSheet = new UpdateCharacterSheetService(
      fakeCharactersRepository,
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('Should be able to update an existant character sheet', async () => {
    // Create a user
    const user = await createSTUser.execute({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
      st_secret: 'GimmeThePower!',
    });

    const char = await createCharacterSheet.execute({
      user_id: user.id,
      player_id: user.id,
      char_name: 'Dracula',
      char_xp: 666,
      sheetFilename: 'dracula.pdf',
      char_email: 'dracula@vampyr.com',
    });

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const charUpdated = await updateCharacterSheet.execute({
      user_id: user.id,
      char_id: char.id,
      char_name: 'Nosferatu',
      char_xp: 999,
      sheetFilename: 'nosferatu.pdf',
    });

    expect(charUpdated).toMatchObject({
      id: char.id,
      user_id: user.id,
      name: 'Nosferatu',
      experience: 999,
      email: char.email,
      file: 'nosferatu.pdf',
    });

    expect(deleteFile).toHaveBeenCalledWith('dracula.pdf', 'sheet');
  });

  it('Should not allow invalid users to update character sheets', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    await expect(
      updateCharacterSheet.execute({
        user_id: 'I am invalid',
        char_id: 'Does not matter',
        char_name: 'Nosferatu',
        char_xp: 999,
        sheetFilename: 'nosferatu.pdf',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });

    expect(deleteFile).toHaveBeenCalledWith('nosferatu.pdf', 'sheet');
  });

  it('Should not allow non storyteller update character sheets', async () => {
    const createInitialUser = new CreateInitialUser(fakeUsersRepository);

    const initialUser = await createInitialUser.execute({
      name: 'A User',
      email: 'user@user.com',
      phone: '12-12345-1234',
    });

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    await expect(
      updateCharacterSheet.execute({
        user_id: initialUser.id,
        char_id: 'Does not matter',
        char_name: 'Nosferatu',
        char_xp: 999,
        sheetFilename: 'nosferatu.pdf',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });

    expect(deleteFile).toHaveBeenCalledWith('nosferatu.pdf', 'sheet');
  });

  it('Should not allow update character sheet with a non PDF file', async () => {
    // Create a user
    const user = await createSTUser.execute({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
      st_secret: 'GimmeThePower!',
    });

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    await expect(
      updateCharacterSheet.execute({
        user_id: user.id,
        char_id: 'Does not matter',
        char_name: 'Nosferatu',
        char_xp: 999,
        sheetFilename: 'nosferatu.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);

    expect(deleteFile).toHaveBeenCalledWith('nosferatu.jpg', 'sheet');
  });

  it('Should not allow update a non existant character sheet', async () => {
    // Create a user
    const user = await createSTUser.execute({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
      st_secret: 'GimmeThePower!',
    });

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    await expect(
      updateCharacterSheet.execute({
        user_id: user.id,
        char_id: 'I do not exist',
        char_name: 'Nosferatu',
        char_xp: 999,
        sheetFilename: 'nosferatu.pdf',
      }),
    ).rejects.toBeInstanceOf(AppError);

    expect(deleteFile).toHaveBeenCalledWith('nosferatu.pdf', 'sheet');
  });

  it('Should allow to update character sheet for character without file', async () => {
    // Create a user
    const user = await createSTUser.execute({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
      st_secret: 'GimmeThePower!',
    });

    const char = await createCharacterSheet.execute({
      user_id: user.id,
      player_id: user.id,
      char_name: 'Dracula',
      char_xp: 666,
      sheetFilename: 'dracula.pdf',
      char_email: 'dracula@vampyr.com',
    });

    jest
      .spyOn(fakeCharactersRepository, 'findById')
      .mockImplementationOnce(async () => {
        const charFake = new Character();

        Object.assign(charFake, {
          id: char.id,
          name: char.name,
          experience: char.experience,
          email: char.email,
          user_id: char.user_id,
        });
        return charFake;
      });

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const charUpdated = await updateCharacterSheet.execute({
      user_id: user.id,
      char_id: char.id,
      char_name: 'Nosferatu',
      char_xp: 999,
      sheetFilename: 'nosferatu.pdf',
    });

    expect(charUpdated).toMatchObject({
      id: char.id,
      user_id: user.id,
      name: 'Nosferatu',
      experience: 999,
      email: char.email,
      file: 'nosferatu.pdf',
    });

    expect(deleteFile).not.toHaveBeenCalled();
  });
});
