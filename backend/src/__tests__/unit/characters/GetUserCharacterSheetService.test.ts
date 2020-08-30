import 'reflect-metadata';
import CreateSTUserService from '@modules/users/services/CreateSTUserService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import CreateCharacterSheetService from '@modules/characters/services/CreateCharacterSheetService';
import GetUserCharacterSheetService from '@modules/characters/services/GetUserCharacterSheetService';
import CreateInitialUser from '@modules/users/services/CreateInitialUserService';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import AppError from '@shared/errors/AppError';

describe('GetUserCharacterSheet', () => {
  it('Should be able get a list of users character sheets', async () => {
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

    const getUserCharacterSheet = new GetUserCharacterSheetService(
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

    await createCharacterSheet.execute({
      user_id: user.id,
      player_id: user.id,
      char_name: 'Dracula',
      char_xp: 666,
      sheetFilename: 'dracula.pdf',
      char_email: 'dracula@vampyr.com',
    });

    await createCharacterSheet.execute({
      user_id: user.id,
      player_id: user.id,
      char_name: 'Nosferatu',
      char_xp: 999,
      sheetFilename: 'nosferatu.pdf',
      char_email: 'nosferatu@vampyr.com',
    });

    const charList = await getUserCharacterSheet.execute({
      user_id: user.id,
      player_id: user.id,
    });

    expect(charList).toHaveLength(2);
    expect(charList[0]).toMatchObject({
      user_id: user.id,
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
      email: 'dracula@vampyr.com',
    });
    expect(charList[1]).toMatchObject({
      user_id: user.id,
      name: 'Nosferatu',
      experience: 999,
      file: 'nosferatu.pdf',
      email: 'nosferatu@vampyr.com',
    });
  });

  it('Should be allow invalid users to get character sheets', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeCharactersRepository = new FakeCharactersRepository();

    const getUserCharacterSheet = new GetUserCharacterSheetService(
      fakeCharactersRepository,
      fakeUsersRepository,
    );

    await expect(
      getUserCharacterSheet.execute({
        user_id: 'I am invalid user',
        player_id: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow non storyteller user to get character sheets from others users', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeCharactersRepository = new FakeCharactersRepository();

    const fakeHashProvider = new FakeHashProvider();
    const createSTUser = new CreateSTUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const createInitialUser = new CreateInitialUser(fakeUsersRepository);

    const getUserCharacterSheet = new GetUserCharacterSheetService(
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

    await expect(
      getUserCharacterSheet.execute({
        user_id: initialUser.id,
        player_id: user.id,
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow to get non existant users character sheets', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeCharactersRepository = new FakeCharactersRepository();

    const fakeHashProvider = new FakeHashProvider();
    const createSTUser = new CreateSTUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const getUserCharacterSheet = new GetUserCharacterSheetService(
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

    await expect(
      getUserCharacterSheet.execute({
        user_id: user.id,
        player_id: 'I do not exist',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow to get a non existant list of character sheets', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeCharactersRepository = new FakeCharactersRepository();

    const fakeHashProvider = new FakeHashProvider();
    const createSTUser = new CreateSTUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const getUserCharacterSheet = new GetUserCharacterSheetService(
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

    await expect(
      getUserCharacterSheet.execute({
        user_id: user.id,
        player_id: user.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
