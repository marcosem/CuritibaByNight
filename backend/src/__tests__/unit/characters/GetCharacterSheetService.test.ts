import 'reflect-metadata';
import CreateSTUserService from '@modules/users/services/CreateSTUserService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import CreateCharacterSheetService from '@modules/characters/services/CreateCharacterSheetService';
import GetCharacterSheetService from '@modules/characters/services/GetCharacterSheetService';
import CreateInitialUser from '@modules/users/services/CreateInitialUserService';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import AppError from '@shared/errors/AppError';

describe('GetCharacterSheet', () => {
  it('Should be able get a character sheet', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();
    const fakeCharactersRepository = new FakeCharactersRepository();

    const fakeHashProvider = new FakeHashProvider();
    const createSTUser = new CreateSTUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const createCharacterSheet = new CreateCharacterSheetService(
      fakeCharactersRepository,
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const getCharacterSheet = new GetCharacterSheetService(
      fakeCharactersRepository,
      fakeUsersRepository,
    );

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

    const charSheet = await getCharacterSheet.execute({
      user_id: user.id,
      char_id: char.id,
    });

    expect(charSheet).toContain(char.file);
  });

  it('Should not be able to get a non existant character sheet', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeCharactersRepository = new FakeCharactersRepository();

    const getCharacterSheet = new GetCharacterSheetService(
      fakeCharactersRepository,
      fakeUsersRepository,
    );

    await expect(
      getCharacterSheet.execute({
        user_id: 'Does not matter',
        char_id: 'I do not exist',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should be allow invalid users to get character sheets', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();
    const fakeCharactersRepository = new FakeCharactersRepository();

    const fakeHashProvider = new FakeHashProvider();
    const createSTUser = new CreateSTUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const createCharacterSheet = new CreateCharacterSheetService(
      fakeCharactersRepository,
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const getCharacterSheet = new GetCharacterSheetService(
      fakeCharactersRepository,
      fakeUsersRepository,
    );

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

    await expect(
      getCharacterSheet.execute({
        user_id: 'I am invalid',
        char_id: char.id,
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow non storyteller user to get character sheets from others users', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();
    const fakeCharactersRepository = new FakeCharactersRepository();

    const fakeHashProvider = new FakeHashProvider();
    const createSTUser = new CreateSTUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const createInitialUser = new CreateInitialUser(fakeUsersRepository);

    const createCharacterSheet = new CreateCharacterSheetService(
      fakeCharactersRepository,
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const getCharacterSheet = new GetCharacterSheetService(
      fakeCharactersRepository,
      fakeUsersRepository,
    );

    // Create a user
    const user = await createSTUser.execute({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
      st_secret: 'GimmeThePower!',
    });

    const initialUser = await createInitialUser.execute({
      name: 'A User',
      email: 'notSTuser@user.com',
      phone: '12-12345-1234',
    });

    const char = await createCharacterSheet.execute({
      user_id: user.id,
      player_id: user.id,
      char_name: 'Dracula',
      char_xp: 666,
      sheetFilename: 'dracula.pdf',
      char_email: 'dracula@vampyr.com',
    });

    await expect(
      getCharacterSheet.execute({
        user_id: initialUser.id,
        char_id: char.id,
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});
