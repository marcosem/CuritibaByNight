import 'reflect-metadata';
import CreateSTUserService from '@modules/users/services/CreateSTUserService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateCharacterSheetService from '@modules/characters/services/UploadCharacterSheetService';
import CreateInitialUser from '@modules/users/services/CreateInitialUserService';
import AppError from '@shared/errors/AppError';

describe('UpdateCharacterSheet', () => {
  it('Should be able to update the character sheet', async () => {
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

    // Create a user
    const user = await createSTUser.execute({
      name: 'A User',
      email: 'user@user.com',
      email_ic: '',
      password: '123456',
      phone: '12-12345-1234',
      st_secret: 'GimmeThePower!',
    });

    const userWithCharacterSheet = await updateUserCharacterSheet.execute({
      player_id: user.id,
      user_id: user.id,
      sheetFilename: 'character.pdf',
    });

    expect(userWithCharacterSheet).toHaveProperty(
      'character_file',
      'character.pdf',
    );
  });

  it('Should delete old character sheet before add new', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const fakeHashProvider = new FakeHashProvider();
    const createSTUser = new CreateSTUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const updateUserCharacterSheet = new UpdateCharacterSheetService(
      fakeUsersRepository,
      fakeStorageProvider,
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

    await updateUserCharacterSheet.execute({
      player_id: user.id,
      user_id: user.id,
      sheetFilename: 'character.pdf',
    });

    const userWithCharacterSheet = await updateUserCharacterSheet.execute({
      player_id: user.id,
      user_id: user.id,
      sheetFilename: 'new_character.pdf',
    });

    expect(deleteFile).toBeCalledWith('character.pdf', 'sheet');
    expect(userWithCharacterSheet).toHaveProperty(
      'character_file',
      'new_character.pdf',
    );
  });

  it('Should not allow invalid users to update character sheets', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserCharacterSheet = new UpdateCharacterSheetService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    await expect(
      updateUserCharacterSheet.execute({
        player_id: 'Does not matter',
        user_id: 'Non Existant User',
        sheetFilename: 'character.pdf',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow non storyteller users to update character sheets', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();
    const createInitialUser = new CreateInitialUser(fakeUsersRepository);

    const updateUserCharacterSheet = new UpdateCharacterSheetService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const nonSTuser = await createInitialUser.execute({
      name: 'A User',
      email: 'user@user.com',
      email_ic: '',
      phone: '12-12345-1234',
    });

    await expect(
      updateUserCharacterSheet.execute({
        player_id: nonSTuser.id,
        user_id: nonSTuser.id,
        sheetFilename: 'character.pdf',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow to update character sheet in non PDF format', async () => {
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
      updateUserCharacterSheet.execute({
        player_id: user.id,
        user_id: user.id,
        sheetFilename: 'character.rtf',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow to update character sheet for non existant users', async () => {
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
      updateUserCharacterSheet.execute({
        player_id: 'I do not exist!',
        user_id: user.id,
        sheetFilename: 'character.pdf',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
