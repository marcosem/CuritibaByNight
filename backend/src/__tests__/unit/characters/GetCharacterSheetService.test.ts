import 'reflect-metadata';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import GetCharacterSheetService from '@modules/characters/services/GetCharacterSheetService';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeCharactersRepository: FakeCharactersRepository;
let getCharacterSheet: GetCharacterSheetService;

describe('GetCharacterSheet', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCharactersRepository = new FakeCharactersRepository();

    getCharacterSheet = new GetCharacterSheetService(
      fakeCharactersRepository,
      fakeUsersRepository,
    );
  });

  it('Should be able get a character sheet', async () => {
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
      email: 'dracula@vampyr.com',
    });

    const charSheet = await getCharacterSheet.execute({
      user_id: user.id,
      char_id: char.id,
    });

    expect(charSheet).toContain(char.file);
  });

  it('Should not be able to get a non existant character sheet', async () => {
    await expect(
      getCharacterSheet.execute({
        user_id: 'Does not matter',
        char_id: 'I do not exist',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should be allow invalid users to get character sheets', async () => {
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
      email: 'dracula@vampyr.com',
    });

    await expect(
      getCharacterSheet.execute({
        user_id: 'I am invalid',
        char_id: char.id,
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

    const char = await fakeCharactersRepository.create({
      user_id: user.id,
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
      email: 'dracula@vampyr.com',
    });
    await expect(
      getCharacterSheet.execute({
        user_id: nonSTUser.id,
        char_id: char.id,
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});
