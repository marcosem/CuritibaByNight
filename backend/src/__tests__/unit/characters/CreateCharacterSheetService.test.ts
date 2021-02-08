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
      char_xp_total: 667,
      char_clan: 'Tzimisce',
      char_title: 'Priest',
      char_coterie: 'Gangue do Parquinho',
      sheetFilename: 'dracula.pdf',
      is_npc: false,
      char_retainer_level: 0,
    });

    expect(char).toHaveProperty('id');
    expect(char).toMatchObject({
      user_id: user.id,
      name: 'Dracula',
      experience: 666,
      experience_total: 667,
      clan: 'Tzimisce',
      title: 'Priest',
      coterie: 'Gangue do Parquinho',
      file: 'dracula.pdf',
      npc: false,
      retainer_level: 0,
    });
  });

  it('Should be able to create a NPC character sheet', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const char = await createCharacterSheet.execute({
      user_id: user.id,
      char_name: 'Dracula',
      char_xp: 666,
      char_xp_total: 667,
      char_clan: 'Tzimisce',
      char_title: 'Priest',
      char_coterie: 'Gangue do Parquinho',
      sheetFilename: 'dracula.pdf',
      is_npc: true,
    });

    expect(char).toHaveProperty('id');
    expect(char).toMatchObject({
      user_id: null,
      name: 'Dracula',
      experience: 666,
      experience_total: 667,
      clan: 'Tzimisce',
      title: 'Priest',
      coterie: 'Gangue do Parquinho',
      file: 'dracula.pdf',
      npc: true,
      retainer_level: 0,
    });
  });

  it('Should create NPC character sheet without setting up an user', async () => {
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
      char_xp_total: 667,
      char_clan: 'Tzimisce',
      char_title: 'Priest',
      char_coterie: 'Gangue do Parquinho',
      sheetFilename: 'dracula.pdf',
      is_npc: true,
      char_retainer_level: 0,
    });

    expect(char).toHaveProperty('id');
    expect(char).toMatchObject({
      user_id: null,
      name: 'Dracula',
      experience: 666,
      experience_total: 667,
      clan: 'Tzimisce',
      title: 'Priest',
      coterie: 'Gangue do Parquinho',
      file: 'dracula.pdf',
      npc: true,
      retainer_level: 0,
    });
  });

  it('Should be able to create a NPC retainer with regnant set', async () => {
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
      char_xp_total: 667,
      char_clan: 'Tzimisce',
      char_title: 'Priest',
      char_coterie: 'Gangue do Parquinho',
      sheetFilename: 'dracula.pdf',
      is_npc: false,
      char_retainer_level: 0,
    });

    const charRetainer = await createCharacterSheet.execute({
      user_id: user.id,
      char_name: 'Valdomiro Troca Tiro',
      char_xp: 0,
      char_xp_total: 0,
      char_clan: 'Ghoul: Tzimisce',
      char_title: '',
      char_coterie: '',
      sheetFilename: 'Dracula - Valdomiro Troca Tiro.pdf',
      is_npc: true,
      char_regnant: char.id,
      char_retainer_level: 3,
    });

    expect(charRetainer).toHaveProperty('id');
    expect(charRetainer).toMatchObject({
      user_id: null,
      name: 'Valdomiro Troca Tiro',
      experience: 100,
      experience_total: 100,
      clan: 'Ghoul: Tzimisce',
      title: '',
      coterie: '',
      file: 'Dracula - Valdomiro Troca Tiro.pdf',
      npc: true,
      regnant: char.id,
      retainer_level: 3,
    });
  });

  it('Should be able to create a PC retainer with regnant set', async () => {
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
      char_xp_total: 667,
      char_clan: 'Tzimisce',
      char_title: 'Priest',
      char_coterie: 'Gangue do Parquinho',
      sheetFilename: 'dracula.pdf',
      is_npc: false,
      char_retainer_level: 0,
    });

    const charRetainer = await createCharacterSheet.execute({
      user_id: user.id,
      player_id: user.id,
      char_name: 'Valdomiro Troca Tiro',
      char_xp: 0,
      char_xp_total: 0,
      char_clan: 'Ghoul: Tzimisce',
      char_title: '',
      char_coterie: '',
      sheetFilename: 'Dracula - Valdomiro Troca Tiro.pdf',
      is_npc: false,
      char_regnant: char.id,
      char_retainer_level: 3,
    });

    expect(charRetainer).toHaveProperty('id');
    expect(charRetainer).toMatchObject({
      user_id: user.id,
      name: 'Valdomiro Troca Tiro',
      experience: 0,
      experience_total: 0,
      clan: 'Ghoul: Tzimisce',
      title: '',
      coterie: '',
      file: 'Dracula - Valdomiro Troca Tiro.pdf',
      npc: false,
      regnant: char.id,
      retainer_level: 3,
    });
  });

  it('Should not be able to create a retainer with a non existant regnant', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      createCharacterSheet.execute({
        user_id: user.id,
        char_name: 'Valdomiro Troca Tiro',
        char_xp: 0,
        char_xp_total: 0,
        char_clan: 'Ghoul: Tzimisce',
        char_title: '',
        char_coterie: '',
        sheetFilename: 'Dracula - Valdomiro Troca Tiro.pdf',
        is_npc: true,
        char_regnant: 'I do not exist',
        char_retainer_level: 3,
      }),
    ).rejects.toBeInstanceOf(AppError);

    expect(deleteFile).toHaveBeenCalledWith(
      'Dracula - Valdomiro Troca Tiro.pdf',
      'sheet',
    );
  });

  it('Should not allow to create a non retainer character with regnant set', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

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
      char_xp_total: 667,
      char_clan: 'Tzimisce',
      char_title: 'Priest',
      char_coterie: 'Gangue do Parquinho',
      sheetFilename: 'dracula.pdf',
      is_npc: false,
      char_retainer_level: 0,
    });

    await expect(
      createCharacterSheet.execute({
        user_id: user.id,
        char_name: 'Nosferatu',
        char_xp: 0,
        char_xp_total: 0,
        char_clan: 'Nosferatu',
        char_title: '',
        char_coterie: '',
        sheetFilename: 'nosferatu.pdf',
        is_npc: true,
        char_regnant: char.id,
        char_retainer_level: 3,
      }),
    ).rejects.toBeInstanceOf(AppError);

    expect(deleteFile).toHaveBeenCalledWith('nosferatu.pdf', 'sheet');
  });

  it('Should not allow not existant user to create character sheets', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    await expect(
      createCharacterSheet.execute({
        user_id: 'I am invalid',
        player_id: 'Does not matter',
        char_name: 'Dracula',
        char_xp: 666,
        char_xp_total: 667,
        char_clan: 'Tzimisce',
        char_title: 'Priest',
        char_coterie: 'Gangue do Parquinho',
        sheetFilename: 'dracula.pdf',
        is_npc: false,
        char_retainer_level: 0,
      }),
    ).rejects.toMatchObject({ statusCode: 401 });

    expect(deleteFile).toHaveBeenCalledWith('dracula.pdf', 'sheet');
  });

  it('Should not allow non storyteller user to create character sheets', async () => {
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
        char_xp_total: 667,
        char_clan: 'Tzimisce',
        char_title: 'Priest',
        char_coterie: 'Gangue do Parquinho',
        sheetFilename: 'dracula.pdf',
        is_npc: false,
        char_retainer_level: 0,
      }),
    ).rejects.toMatchObject({ statusCode: 401 });

    expect(deleteFile).toHaveBeenCalledWith('dracula.pdf', 'sheet');
  });

  it('Should not allow to create character sheets with a non PDF file', async () => {
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
        char_xp_total: 667,
        char_clan: 'Tzimisce',
        char_title: 'Priest',
        char_coterie: 'Gangue do Parquinho',
        sheetFilename: 'dracula.jpg',
        is_npc: false,
        char_retainer_level: 0,
      }),
    ).rejects.toBeInstanceOf(AppError);

    expect(deleteFile).toHaveBeenCalledWith('dracula.jpg', 'sheet');
  });

  it('Should not allow to create character sheets for non existant users', async () => {
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
        char_xp_total: 667,
        char_clan: 'Tzimisce',
        char_title: 'Priest',
        char_coterie: 'Gangue do Parquinho',
        sheetFilename: 'dracula.pdf',
        is_npc: false,
        char_retainer_level: 0,
      }),
    ).rejects.toBeInstanceOf(AppError);

    expect(deleteFile).toHaveBeenCalledWith('dracula.pdf', 'sheet');
  });
});
