import 'reflect-metadata';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import GetCharacterService from '@modules/characters/services/GetCharacterService';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeCharactersRepository: FakeCharactersRepository;
let getCharacter: GetCharacterService;

describe('GetCharacter', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCharactersRepository = new FakeCharactersRepository();

    getCharacter = new GetCharacterService(
      fakeCharactersRepository,
      fakeUsersRepository,
    );
  });

  it('Should be able get a character sheet', async () => {
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
      npc: false,
    });

    const charLoaded = await getCharacter.execute({
      user_id: user.id,
      char_id: char.id,
    });

    expect(charLoaded).toMatchObject({
      id: char.id,
      name: char.name,
      experience: char.experience,
      file: char.file,
    });
  });

  it('Should be able get a retainer character sheet', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const charRegnant = await fakeCharactersRepository.create({
      user_id: user.id,
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
      npc: false,
    });

    const char = await fakeCharactersRepository.create({
      name: 'Igor',
      experience: 20,
      file: 'igor.pdf',
      npc: true,
      regnant: charRegnant.id,
    });

    const charLoaded = await getCharacter.execute({
      user_id: user.id,
      char_id: char.id,
    });

    expect(charLoaded).toMatchObject({
      id: char.id,
      name: char.name,
      experience: char.experience,
      file: char.file,
    });
  });

  it('Should not be able to get a non existant character sheet', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      getCharacter.execute({
        user_id: user.id,
        char_id: 'I do not exist',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able get a non existant retainer character sheet', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const char = await fakeCharactersRepository.create({
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
      npc: true,
      regnant: 'I do not exist!',
    });

    await expect(
      getCharacter.execute({
        user_id: user.id,
        char_id: char.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should be allow invalid users to get character sheets', async () => {
    await expect(
      getCharacter.execute({
        user_id: 'I am invalid',
        char_id: 'Does not Matter',
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

    const char = await fakeCharactersRepository.create({
      user_id: user.id,
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
      npc: false,
    });

    await expect(
      getCharacter.execute({
        user_id: nonSTUser.id,
        char_id: char.id,
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});
