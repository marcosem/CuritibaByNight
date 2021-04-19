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
      experience_total: 667,
      file: 'dracula.pdf',
      clan: 'Tzimisce',
      title: 'Priest',
      coterie: 'Gangue do Parquinho',
      situation: 'active',
      npc: false,
    });

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const charUpdated = await updateCharacterSheet.execute({
      user_id: user.id,
      char_id: char.id,
      char_name: 'Nosferatu',
      char_xp: 1,
      char_xp_total: 2,
      char_clan: 'Nosferatu',
      char_creature_type: 'Vampire',
      char_sect: 'Camarilla',
      char_title: 'Prince',
      char_coterie: '',
      char_situation: 'inactive',
      sheetFilename: 'nosferatu.pdf',
      update: 'Updated',
      is_npc: false,
      char_retainer_level: 0,
    });

    expect(charUpdated).toMatchObject({
      id: char.id,
      user_id: user.id,
      name: 'Nosferatu',
      creature_type: 'Vampire',
      sect: 'Camarilla',
      experience: 1,
      experience_total: 2,
      clan: 'Nosferatu',
      title: 'Prince',
      coterie: '',
      situation: 'inactive',
      file: 'nosferatu.pdf',
      retainer_level: 0,
    });

    expect(deleteFile).toHaveBeenCalledWith('dracula.pdf', 'sheet');
  });

  it('Should be able to update an existant NPC character sheet', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const char = await fakeCharactersRepository.create({
      name: 'Dracula',
      experience: 666,
      experience_total: 667,
      file: 'dracula.pdf',
      clan: 'Tzimisce',
      creature_type: 'Vampire',
      sect: 'Sabbat',
      title: 'Priest',
      coterie: 'Gangue do Parquinho',
      npc: true,
    });

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const charUpdated = await updateCharacterSheet.execute({
      user_id: user.id,
      char_id: char.id,
      char_name: 'Nosferatu',
      char_xp: 1,
      char_xp_total: 2,
      char_clan: 'Nosferatu',
      char_creature_type: 'Vampire',
      char_sect: 'Camarilla',
      char_title: 'Prince',
      char_coterie: '',
      char_situation: 'active',
      sheetFilename: 'nosferatu.pdf',
      update: 'Updated',
      is_npc: true,
    });

    expect(charUpdated).toMatchObject({
      id: char.id,
      user_id: null,
      name: 'Nosferatu',
      experience: 1,
      experience_total: 2,
      clan: 'Nosferatu',
      creature_type: 'Vampire',
      sect: 'Camarilla',
      title: 'Prince',
      coterie: '',
      file: 'nosferatu.pdf',
      npc: true,
      retainer_level: 0,
    });

    expect(deleteFile).toHaveBeenCalledWith('dracula.pdf', 'sheet');
  });

  it('Should be able to update an existant PC character sheet to NPC', async () => {
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
      experience_total: 667,
      file: 'dracula.pdf',
      clan: 'Tzimisce',
      title: 'Priest',
      coterie: 'Gangue do Parquinho',
      npc: false,
      retainer_level: 0,
    });

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const charUpdated = await updateCharacterSheet.execute({
      user_id: user.id,
      char_id: char.id,
      char_name: 'Nosferatu',
      char_xp: 1,
      char_xp_total: 2,
      char_clan: 'Nosferatu',
      char_creature_type: 'Vampire',
      char_sect: 'Camarilla',
      char_title: 'Prince',
      char_coterie: '',
      char_situation: 'active',
      sheetFilename: 'nosferatu.pdf',
      update: 'Updated',
      is_npc: true,
      char_retainer_level: 0,
    });

    expect(charUpdated).toMatchObject({
      id: char.id,
      user_id: null,
      name: 'Nosferatu',
      experience: 1,
      experience_total: 2,
      clan: 'Nosferatu',
      creature_type: 'Vampire',
      sect: 'Camarilla',
      title: 'Prince',
      coterie: '',
      file: 'nosferatu.pdf',
      npc: true,
      retainer_level: 0,
    });

    expect(deleteFile).toHaveBeenCalledWith('dracula.pdf', 'sheet');
  });

  it('Should be able to update an retainer', async () => {
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
      experience_total: 667,
      file: 'dracula.pdf',
      clan: 'Tzimisce',
      title: 'Priest',
      coterie: 'Gangue do Parquinho',
      npc: false,
    });

    const charRetainer = await fakeCharactersRepository.create({
      // user_id: user.id,
      name: 'Valdomiro Troca Tiro',
      experience: 0,
      experience_total: 0,
      file: 'valdomiro.pdf',
      clan: 'Mortal',
      title: '',
      coterie: '',
      npc: true,
      regnant: char.id,
      retainer_level: 0,
    });

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const charUpdated = await updateCharacterSheet.execute({
      user_id: user.id,
      char_id: charRetainer.id,
      char_name: 'Valdomirão',
      char_xp: 1,
      char_xp_total: 2,
      char_clan: 'Ghoul: Tzimisce',
      char_creature_type: 'Mortal',
      char_sect: '',
      char_title: '',
      char_coterie: '',
      char_situation: 'active',
      sheetFilename: 'valdomirao.pdf',
      update: 'Updated',
      is_npc: true,
      char_regnant: char.id,
      char_retainer_level: 4,
    });

    expect(charUpdated).toMatchObject({
      user_id: null,
      id: charRetainer.id,
      name: 'Valdomirão',
      experience: 132,
      experience_total: 133,
      clan: 'Ghoul: Tzimisce',
      creature_type: 'Mortal',
      sect: '',
      title: '',
      coterie: '',
      file: 'valdomirao.pdf',
      regnant: char.id,
      retainer_level: 4,
    });

    expect(deleteFile).toHaveBeenCalledWith('valdomiro.pdf', 'sheet');
  });

  it('Should be able to remove an retainer from a character', async () => {
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
      experience_total: 667,
      file: 'dracula.pdf',
      clan: 'Tzimisce',
      title: 'Priest',
      coterie: 'Gangue do Parquinho',
      npc: false,
    });

    const charRetainer = await fakeCharactersRepository.create({
      name: 'Valdomiro Troca Tiro',
      experience: 0,
      experience_total: 0,
      file: 'valdomiro.pdf',
      clan: 'Mortal',
      title: '',
      coterie: '',
      npc: true,
      regnant: char.id,
      retainer_level: 0,
      situation: 'active',
    });

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const charUpdated = await updateCharacterSheet.execute({
      user_id: user.id,
      char_id: charRetainer.id,
      char_name: 'Valdomirão',
      char_xp: 1,
      char_xp_total: 2,
      char_clan: 'Ghoul: Tzimisce',
      char_creature_type: 'Mortal',
      char_sect: '',
      char_title: '',
      char_coterie: '',
      char_situation: 'active',
      sheetFilename: 'valdomirao.pdf',
      update: 'Updated',
      is_npc: true,
      char_regnant: null,
      char_retainer_level: 4,
    });

    expect(charUpdated).toMatchObject({
      user_id: null,
      id: charRetainer.id,
      name: 'Valdomirão',
      experience: 1,
      experience_total: 2,
      clan: 'Ghoul: Tzimisce',
      creature_type: 'Mortal',
      sect: '',
      title: '',
      coterie: '',
      file: 'valdomirao.pdf',
      regnant: null,
      retainer_level: 4,
    });

    expect(deleteFile).toHaveBeenCalledWith('valdomiro.pdf', 'sheet');
  });

  it('Should be able to update an existant mortal character sheet to retainer', async () => {
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
      experience_total: 667,
      file: 'dracula.pdf',
      clan: 'Tzimisce',
      title: 'Priest',
      coterie: 'Gangue do Parquinho',
      npc: false,
    });

    const charRetainer = await fakeCharactersRepository.create({
      name: 'Valdomiro Troca Tiro',
      experience: 0,
      experience_total: 0,
      file: 'valdomiro.pdf',
      clan: 'Mortal',
      title: '',
      coterie: '',
      npc: true,
      retainer_level: 0,
    });

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const charUpdated = await updateCharacterSheet.execute({
      user_id: user.id,
      char_id: charRetainer.id,
      char_name: 'Valdomirão',
      char_xp: 1,
      char_xp_total: 2,
      char_clan: 'Ghoul: Tzimisce',
      char_creature_type: 'Mortal',
      char_sect: '',
      char_title: '',
      char_coterie: '',
      char_situation: 'active',
      sheetFilename: 'valdomirao.pdf',
      update: 'Updated',
      is_npc: true,
      char_regnant: char.id,
      char_retainer_level: 4,
    });

    expect(charUpdated).toMatchObject({
      user_id: null,
      id: charRetainer.id,
      name: 'Valdomirão',
      experience: 132,
      experience_total: 133,
      clan: 'Ghoul: Tzimisce',
      creature_type: 'Mortal',
      sect: '',
      title: '',
      coterie: '',
      file: 'valdomirao.pdf',
      regnant: char.id,
      retainer_level: 4,
    });

    expect(deleteFile).toHaveBeenCalledWith('valdomiro.pdf', 'sheet');
  });

  it('Should be able to update an retainer character sheet to another regnant', async () => {
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
      experience_total: 667,
      file: 'dracula.pdf',
      clan: 'Tzimisce',
      title: 'Priest',
      coterie: 'Gangue do Parquinho',
      npc: false,
    });

    const newRegnant = await fakeCharactersRepository.create({
      user_id: user.id,
      name: 'Nosferatu',
      experience: 10,
      experience_total: 20,
      file: 'nosferatu.pdf',
      clan: 'Nosferatu',
      title: 'Prince',
      coterie: '',
      npc: false,
    });

    const charRetainer = await fakeCharactersRepository.create({
      name: 'Valdomiro Troca Tiro',
      experience: 0,
      experience_total: 0,
      file: 'valdomiro.pdf',
      clan: 'Mortal Retainer',
      title: '',
      coterie: '',
      npc: true,
      regnant: char.id,
      retainer_level: 2,
    });

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const charUpdated = await updateCharacterSheet.execute({
      user_id: user.id,
      char_id: charRetainer.id,
      char_name: 'Valdomirão',
      char_xp: 1,
      char_xp_total: 2,
      char_clan: 'Mortal Retainer',
      char_creature_type: 'Mortal',
      char_sect: '',
      char_title: '',
      char_coterie: '',
      char_situation: 'active',
      sheetFilename: 'valdomirao.pdf',
      update: 'Updated',
      is_npc: true,
      char_regnant: newRegnant.id,
      char_retainer_level: 3,
    });

    expect(charUpdated).toMatchObject({
      user_id: null,
      id: charRetainer.id,
      name: 'Valdomirão',
      experience: 2,
      experience_total: 3,
      clan: 'Mortal Retainer',
      creature_type: 'Mortal',
      sect: '',
      title: '',
      coterie: '',
      file: 'valdomirao.pdf',
      regnant: newRegnant.id,
      retainer_level: 3,
    });

    expect(deleteFile).toHaveBeenCalledWith('valdomiro.pdf', 'sheet');
  });

  it('Should be able to update an retainer without change his regent', async () => {
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
      experience_total: 667,
      file: 'dracula.pdf',
      clan: 'Tzimisce',
      title: 'Priest',
      coterie: 'Gangue do Parquinho',
      npc: false,
    });

    const charRetainer = await fakeCharactersRepository.create({
      name: 'Valdomiro Troca Tiro',
      experience: 0,
      experience_total: 0,
      file: 'valdomiro.pdf',
      clan: 'Mortal Retainer',
      title: '',
      coterie: '',
      npc: true,
      regnant: char.id,
      retainer_level: 2,
    });

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const charUpdated = await updateCharacterSheet.execute({
      user_id: user.id,
      char_id: charRetainer.id,
      char_name: 'Valdomirão',
      char_xp: 66,
      char_xp_total: 67,
      char_clan: 'Mortal Retainer',
      char_creature_type: 'Mortal',
      char_sect: '',
      char_title: '',
      char_coterie: '',
      char_situation: 'active',
      sheetFilename: 'valdomirao.pdf',
      update: 'Updated',
      is_npc: true,
      char_retainer_level: 3,
    });

    expect(charUpdated).toMatchObject({
      user_id: null,
      id: charRetainer.id,
      name: 'Valdomirão',
      experience: 99,
      experience_total: 100,
      clan: 'Mortal Retainer',
      creature_type: 'Mortal',
      sect: '',
      title: '',
      coterie: '',
      file: 'valdomirao.pdf',
      regnant: char.id,
      retainer_level: 3,
    });

    expect(deleteFile).toHaveBeenCalledWith('valdomiro.pdf', 'sheet');
  });

  it('Should not allow an retainer character sheet be his own regnant', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const charRetainer = await fakeCharactersRepository.create({
      name: 'Valdomiro Troca Tiro',
      experience: 0,
      experience_total: 0,
      file: 'valdomiro.pdf',
      clan: 'Mortal Retainer',
      title: '',
      coterie: '',
      npc: true,
      retainer_level: 0,
    });

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    await expect(
      updateCharacterSheet.execute({
        user_id: user.id,
        char_id: charRetainer.id,
        char_name: 'Valdomirão',
        char_xp: 1,
        char_xp_total: 2,
        char_clan: 'Mortal Retainer',
        char_creature_type: 'Mortal',
        char_sect: '',
        char_title: '',
        char_coterie: '',
        char_situation: 'active',
        sheetFilename: 'valdomirao.pdf',
        update: 'Updated',
        is_npc: true,
        char_regnant: charRetainer.id,
        char_retainer_level: 1,
      }),
    ).rejects.toBeInstanceOf(AppError);

    expect(deleteFile).toHaveBeenCalledWith('valdomirao.pdf', 'sheet');
  });

  it('Should not allow a non mortal character to have a regnant', async () => {
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
      experience_total: 667,
      file: 'dracula.pdf',
      clan: 'Tzimisce',
      title: 'Priest',
      coterie: 'Gangue do Parquinho',
      npc: false,
    });

    const charRegnant = await fakeCharactersRepository.create({
      user_id: user.id,
      name: 'Nosferatu',
      experience: 10,
      experience_total: 20,
      file: 'nosferatu.pdf',
      clan: 'Nosferatu',
      title: 'Prince',
      coterie: '',
      npc: false,
    });

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    await expect(
      updateCharacterSheet.execute({
        user_id: user.id,
        char_id: char.id,
        char_name: 'Dracula',
        char_xp: 666,
        char_xp_total: 667,
        char_clan: 'Tzimisce',
        char_creature_type: 'Vampire',
        char_sect: 'Sabbat',
        char_title: 'Priest',
        char_coterie: 'Gangue do Parquinho',
        char_situation: 'active',
        sheetFilename: 'dracula2.pdf',
        update: 'Updated',
        is_npc: true,
        char_regnant: charRegnant.id,
        char_retainer_level: 1,
      }),
    ).rejects.toBeInstanceOf(AppError);

    expect(deleteFile).toHaveBeenCalledWith('dracula2.pdf', 'sheet');
  });

  it('Should not allow an invalid regnant to be set to retainer character sheet', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const charRetainer = await fakeCharactersRepository.create({
      name: 'Valdomiro Troca Tiro',
      experience: 0,
      experience_total: 0,
      file: 'valdomiro.pdf',
      clan: 'Mortal Retainer',
      title: '',
      coterie: '',
      npc: true,
      retainer_level: 0,
    });

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    await expect(
      updateCharacterSheet.execute({
        user_id: user.id,
        char_id: charRetainer.id,
        char_name: 'Valdomirão',
        char_xp: 1,
        char_xp_total: 2,
        char_clan: 'Mortal Retainer',
        char_creature_type: 'Mortal',
        char_sect: '',
        char_title: '',
        char_coterie: '',
        char_situation: 'active',
        sheetFilename: 'valdomirao.pdf',
        update: 'Updated',
        is_npc: true,
        char_regnant: 'I do not exist!',
        char_retainer_level: 1,
      }),
    ).rejects.toBeInstanceOf(AppError);

    expect(deleteFile).toHaveBeenCalledWith('valdomirao.pdf', 'sheet');
  });

  it('Should not allow invalid users to update character sheets', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    await expect(
      updateCharacterSheet.execute({
        user_id: 'I am invalid',
        char_id: 'Does not matter',
        char_name: 'Nosferatu',
        char_xp: 999,
        char_xp_total: 1000,
        char_clan: 'Nosferatu',
        char_creature_type: 'Vampire',
        char_sect: 'Camarilla',
        char_title: 'Prince',
        char_coterie: '',
        char_situation: 'active',
        sheetFilename: 'nosferatu.pdf',
        update: 'Updated',
        is_npc: false,
        char_retainer_level: 0,
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
        char_xp_total: 1000,
        char_clan: 'Nosferatu',
        char_creature_type: 'Vampire',
        char_sect: 'Camarilla',
        char_title: 'Prince',
        char_coterie: '',
        char_situation: 'active',
        sheetFilename: 'nosferatu.pdf',
        update: 'Updated',
        is_npc: false,
        char_retainer_level: 0,
      }),
    ).rejects.toMatchObject({ statusCode: 401 });

    expect(deleteFile).toHaveBeenCalledWith('nosferatu.pdf', 'sheet');
  });

  it('Should not allow update character sheet with a non PDF file', async () => {
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
        char_xp_total: 1000,
        char_clan: 'Nosferatu',
        char_creature_type: 'Vampire',
        char_sect: 'Camarilla',
        char_title: 'Prince',
        char_coterie: '',
        char_situation: 'active',
        sheetFilename: 'nosferatu.jpg',
        update: 'Updated',
        is_npc: false,
        char_retainer_level: 0,
      }),
    ).rejects.toBeInstanceOf(AppError);

    expect(deleteFile).toHaveBeenCalledWith('nosferatu.jpg', 'sheet');
  });

  it('Should not allow update a non existant character sheet', async () => {
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
        char_xp_total: 1000,
        char_clan: 'Nosferatu',
        char_creature_type: 'Vampire',
        char_sect: 'Camarilla',
        char_title: 'Prince',
        char_coterie: '',
        char_situation: 'active',
        sheetFilename: 'nosferatu.pdf',
        update: 'Updated',
        is_npc: false,
        char_retainer_level: 0,
      }),
    ).rejects.toBeInstanceOf(AppError);

    expect(deleteFile).toHaveBeenCalledWith('nosferatu.pdf', 'sheet');
  });

  it('Should allow to update character sheet for character without file', async () => {
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
      npc: false,
    });

    jest
      .spyOn(fakeCharactersRepository, 'findById')
      .mockImplementationOnce(async () => {
        const charFake = new Character();

        Object.assign(charFake, {
          id: char.id,
          name: char.name,
          experience: char.experience,
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
      char_xp_total: 1000,
      char_clan: 'Nosferatu',
      char_creature_type: 'Vampire',
      char_sect: 'Camarilla',
      char_title: 'Prince',
      char_coterie: '',
      char_situation: 'active',
      sheetFilename: 'nosferatu.pdf',
      update: 'Updated',
      is_npc: false,
      char_retainer_level: 0,
    });

    expect(charUpdated).toMatchObject({
      id: char.id,
      user_id: user.id,
      name: 'Nosferatu',
      experience: 999,
      experience_total: 1000,
      file: 'nosferatu.pdf',
      retainer_level: 0,
    });

    expect(deleteFile).not.toHaveBeenCalled();
  });

  it('Should not allow to update character sheet for non existant user', async () => {
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
      experience_total: 667,
      file: 'dracula.pdf',
      clan: 'Tzimisce',
      npc: false,
      retainer_level: 0,
    });

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    await expect(
      updateCharacterSheet.execute({
        user_id: user.id,
        char_id: char.id,
        char_name: 'Nosferatu',
        char_xp: 1,
        char_xp_total: 2,
        char_clan: 'Nosferatu',
        char_creature_type: 'Vampire',
        char_sect: 'Camarilla',
        char_title: 'Prince',
        char_coterie: '',
        char_situation: 'active',
        sheetFilename: 'nosferatu.pdf',
        update: 'Updated',
        is_npc: false,
        char_retainer_level: 0,
      }),
    ).rejects.toBeInstanceOf(AppError);

    expect(deleteFile).toHaveBeenCalledWith('dracula.pdf', 'sheet');
  });
});
