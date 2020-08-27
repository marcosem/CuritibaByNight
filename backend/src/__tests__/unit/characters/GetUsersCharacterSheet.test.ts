import 'reflect-metadata';
import CreateSTUserService from '@modules/users/services/CreateSTUserService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import GetUserCharacterSheetService from '@modules/characters/services/GetUserCharacterSheetService';
import UpdateCharacterSheetService from '@modules/characters/services/UploadCharacterSheetService';
import CreateInitialUser from '@modules/users/services/CreateInitialUserService';
import AppError from '@shared/errors/AppError';

describe('GetUserCharacterSheet', () => {
  it('Should be able get an user character sheet file path', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();
    const fakeHashProvider = new FakeHashProvider();
    const createSTUser = new CreateSTUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const updateUserCharacterSheet = new UpdateCharacterSheetService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const getCharacterSheet = new GetUserCharacterSheetService(
      fakeUsersRepository,
    );

    // Create a user
    const user = await createSTUser.execute({
      name: 'A User',
      email: 'user@user.com',
      email_ic: '',
      password: '123456',
      phone: '12-12345-1234',
      st_secret: 'GimmeThePower!',
    });

    // Add a chracter sheet
    const userWithCharacterSheet = await updateUserCharacterSheet.execute({
      player_id: user.id,
      user_id: user.id,
      sheetFilename: 'character.pdf',
    });

    const characterFile = await getCharacterSheet.execute({
      user_id: user.id,
      player_id: user.id,
    });

    expect(characterFile).toContain(userWithCharacterSheet.character_file);
  });

  it('Should not allow invalid users to get users character sheets', async () => {
    const fakeUsersRepository = new FakeUsersRepository();

    const getCharacterSheet = new GetUserCharacterSheetService(
      fakeUsersRepository,
    );

    await expect(
      getCharacterSheet.execute({
        user_id: 'Does not matter',
        player_id: 'Invalid User',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow non storyteller to get character sheet for other users', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createInitialUser = new CreateInitialUser(fakeUsersRepository);

    const getCharacterSheet = new GetUserCharacterSheetService(
      fakeUsersRepository,
    );

    const nonSTuser = await createInitialUser.execute({
      name: 'A User',
      email: 'user@user.com',
      email_ic: '',
      phone: '12-12345-1234',
    });

    await expect(
      getCharacterSheet.execute({
        user_id: nonSTuser.id,
        player_id: 'Any other user',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not be able to get character sheets from invalid users', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createSTUser = new CreateSTUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const getCharacterSheet = new GetUserCharacterSheetService(
      fakeUsersRepository,
    );

    // Create a user
    const user = await createSTUser.execute({
      name: 'A User',
      email: 'user@user.com',
      email_ic: '',
      password: '123456',
      phone: '12-12345-1234',
      st_secret: 'GimmeThePower!',
    });

    await expect(
      getCharacterSheet.execute({
        user_id: user.id,
        player_id: 'I do not exist',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to get character sheets from users whose does not have one', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createSTUser = new CreateSTUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const getCharacterSheet = new GetUserCharacterSheetService(
      fakeUsersRepository,
    );

    // Create a user
    const user = await createSTUser.execute({
      name: 'A User',
      email: 'user@user.com',
      email_ic: '',
      password: '123456',
      phone: '12-12345-1234',
      st_secret: 'GimmeThePower!',
    });

    await expect(
      getCharacterSheet.execute({
        user_id: user.id,
        player_id: user.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
