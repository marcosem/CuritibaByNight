import 'reflect-metadata';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import GetUserCharacterSheetService from '@modules/characters/services/GetUserCharacterSheetService';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeCharactersRepository: FakeCharactersRepository;
let getUserCharacterSheet: GetUserCharacterSheetService;

describe('GetUserCharacterSheet', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCharactersRepository = new FakeCharactersRepository();

    getUserCharacterSheet = new GetUserCharacterSheetService(
      fakeCharactersRepository,
      fakeUsersRepository,
    );
  });

  it('Should be able get a list of users character sheets', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await fakeCharactersRepository.create({
      user_id: user.id,
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
    });

    await fakeCharactersRepository.create({
      user_id: user.id,
      name: 'Nosferatu',
      experience: 999,
      file: 'nosferatu.pdf',
    });

    const charList = await getUserCharacterSheet.execute({
      user_id: user.id,
      player_id: user.id,
      situation: 'all',
    });

    expect(charList).toHaveLength(2);
    expect(charList[0]).toMatchObject({
      user_id: user.id,
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
    });
    expect(charList[1]).toMatchObject({
      user_id: user.id,
      name: 'Nosferatu',
      experience: 999,
      file: 'nosferatu.pdf',
    });
  });

  it('Should be able to load only characters sheets of specific situation', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await fakeCharactersRepository.create({
      user_id: user.id,
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
    });

    await fakeCharactersRepository.create({
      user_id: user.id,
      name: 'Nosferatu',
      experience: 999,
      file: 'nosferatu.pdf',
      situation: 'inactive',
    });

    const charList = await getUserCharacterSheet.execute({
      user_id: user.id,
      player_id: user.id,
      situation: 'inactive',
    });

    expect(charList).toHaveLength(1);
    expect(charList[0]).toMatchObject({
      user_id: user.id,
      name: 'Nosferatu',
      experience: 999,
      file: 'nosferatu.pdf',
    });
  });

  it('Should not allow invalid users to get character sheets', async () => {
    await expect(
      getUserCharacterSheet.execute({
        user_id: 'I am invalid user',
        player_id: 'Does not matter',
        situation: 'all',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow non storyteller user to get character sheets from others users', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
    });

    const nonSTUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'notSTuser@user.com',
      password: '123456',
    });

    await expect(
      getUserCharacterSheet.execute({
        user_id: nonSTUser.id,
        player_id: user.id,
        situation: 'all',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow to get non existant users character sheets', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      getUserCharacterSheet.execute({
        user_id: user.id,
        player_id: 'I do not exist',
        situation: 'all',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow to get a non existant list of character sheets', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      getUserCharacterSheet.execute({
        user_id: user.id,
        player_id: user.id,
        situation: 'all',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
