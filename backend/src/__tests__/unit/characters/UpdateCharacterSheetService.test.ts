import 'reflect-metadata';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateCharacterSheetService from '@modules/characters/services/UpdateCharacterSheetService';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import Character from '@modules/characters/infra/typeorm/entities/Character';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let fakeCharactersRepository: FakeCharactersRepository;
let fakeMailProvider: FakeMailProvider;
let updateCharacterSheet: UpdateCharacterSheetService;

describe('UpdateCharacterSheet', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    fakeCharactersRepository = new FakeCharactersRepository();
    fakeMailProvider = new FakeMailProvider();

    updateCharacterSheet = new UpdateCharacterSheetService(
      fakeCharactersRepository,
      fakeUsersRepository,
      fakeStorageProvider,
      fakeMailProvider,
    );
  });

  it('Should be able to update an existant character sheet', async () => {
    // Create a user
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const char = await fakeCharactersRepository.create({
      user_id: user.id,
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
      clan: 'Tzimisce',
      email: 'dracula@vampyr.com',
    });

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const charUpdated = await updateCharacterSheet.execute({
      user_id: user.id,
      char_id: char.id,
      char_name: 'Nosferatu',
      char_xp: 1,
      char_clan: 'Nosferatu',
      sheetFilename: 'nosferatu.pdf',
      update: 'Updated',
    });

    expect(charUpdated).toMatchObject({
      id: char.id,
      user_id: user.id,
      name: 'Nosferatu',
      experience: 1,
      email: char.email,
      clan: 'Nosferatu',
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
        char_clan: 'Nosferatu',
        sheetFilename: 'nosferatu.pdf',
        update: 'Updated',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });

    expect(deleteFile).toHaveBeenCalledWith('nosferatu.pdf', 'sheet');
  });

  it('Should not allow non storyteller update character sheets', async () => {
    const noSTUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: false,
    });

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    await expect(
      updateCharacterSheet.execute({
        user_id: noSTUser.id,
        char_id: 'Does not matter',
        char_name: 'Nosferatu',
        char_xp: 999,
        char_clan: 'Nosferatu',
        sheetFilename: 'nosferatu.pdf',
        update: 'Updated',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });

    expect(deleteFile).toHaveBeenCalledWith('nosferatu.pdf', 'sheet');
  });

  it('Should not allow update character sheet with a non PDF file', async () => {
    // Create a user
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    await expect(
      updateCharacterSheet.execute({
        user_id: user.id,
        char_id: 'Does not matter',
        char_name: 'Nosferatu',
        char_xp: 999,
        char_clan: 'Nosferatu',
        sheetFilename: 'nosferatu.jpg',
        update: 'Updated',
      }),
    ).rejects.toBeInstanceOf(AppError);

    expect(deleteFile).toHaveBeenCalledWith('nosferatu.jpg', 'sheet');
  });

  it('Should not allow update a non existant character sheet', async () => {
    // Create a user
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    await expect(
      updateCharacterSheet.execute({
        user_id: user.id,
        char_id: 'I do not exist',
        char_name: 'Nosferatu',
        char_xp: 999,
        char_clan: 'Nosferatu',
        sheetFilename: 'nosferatu.pdf',
        update: 'Updated',
      }),
    ).rejects.toBeInstanceOf(AppError);

    expect(deleteFile).toHaveBeenCalledWith('nosferatu.pdf', 'sheet');
  });

  it('Should allow to update character sheet for character without file', async () => {
    // Create a user
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const char = await fakeCharactersRepository.create({
      user_id: user.id,
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
      clan: 'Tzimisce',
      email: 'dracula@vampyr.com',
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
      char_clan: 'Nosferatu',
      sheetFilename: 'nosferatu.pdf',
      update: 'Updated',
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

  it('Should not allow to update character sheet for non existant user', async () => {
    // Create a user
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const char = await fakeCharactersRepository.create({
      user_id: 'I do not exist',
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
      clan: 'Tzimisce',
      email: 'dracula@vampyr.com',
    });

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    await expect(
      updateCharacterSheet.execute({
        user_id: user.id,
        char_id: char.id,
        char_name: 'Nosferatu',
        char_xp: 1,
        char_clan: 'Nosferatu',
        sheetFilename: 'nosferatu.pdf',
        update: 'Updated',
      }),
    ).rejects.toBeInstanceOf(AppError);

    expect(deleteFile).toHaveBeenCalledWith('dracula.pdf', 'sheet');
  });
});
