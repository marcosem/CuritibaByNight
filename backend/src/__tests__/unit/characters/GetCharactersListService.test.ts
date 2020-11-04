import 'reflect-metadata';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
// import GetCharacterService from '@modules/characters/services/GetCharacterService';
import GetCharactersListService from '@modules/characters/services/GetCharactersListService';

import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeCharactersRepository: FakeCharactersRepository;
let getCharactersList: GetCharactersListService;

describe('GetCharactersListService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCharactersRepository = new FakeCharactersRepository();

    getCharactersList = new GetCharactersListService(
      fakeCharactersRepository,
      fakeUsersRepository,
    );
  });

  it('Should be able get a list of all characters sheet', async () => {
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
      situation: 'inactive',
    });

    const charList = await getCharactersList.execute({
      user_id: user.id,
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

  it('Should not allow invalid users to get character sheets', async () => {
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

    await expect(
      getCharactersList.execute({
        user_id: 'I am invalid',
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

    await fakeCharactersRepository.create({
      user_id: user.id,
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
      email: 'dracula@vampyr.com',
    });

    await expect(
      getCharactersList.execute({
        user_id: nonSTUser.id,
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});
