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
    // Create a user
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
      email: 'dracula@vampyr.com',
    });

    await fakeCharactersRepository.create({
      user_id: user.id,
      name: 'Nosferatu',
      experience: 999,
      file: 'nosferatu.pdf',
      email: 'nosferatu@vampyr.com',
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
    await expect(
      getUserCharacterSheet.execute({
        user_id: 'I am invalid user',
        player_id: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow non storyteller user to get character sheets from others users', async () => {
    // Create a user
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
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow to get non existant users character sheets', async () => {
    // Create a user
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
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow to get a non existant list of character sheets', async () => {
    // Create a user
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
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});