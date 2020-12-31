import 'reflect-metadata';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import GetCharactersListService from '@modules/characters/services/GetCharactersListService';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeCharactersRepository: FakeCharactersRepository;
let getCharactersList: GetCharactersListService;

describe('GetCharactersList', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCharactersRepository = new FakeCharactersRepository();

    getCharactersList = new GetCharactersListService(
      fakeCharactersRepository,
      fakeUsersRepository,
    );
  });

  it('Should be able get a list of all characters sheet', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await fakeCharactersRepository.create({
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
      npc: true,
    });

    await fakeCharactersRepository.create({
      user_id: user.id,
      name: 'Nosferatu',
      experience: 999,
      file: 'nosferatu.pdf',
      situation: 'inactive',
      npc: false,
    });

    const charList = await getCharactersList.execute({
      user_id: user.id,
    });

    expect(charList).toHaveLength(2);
    expect(charList[0]).toMatchObject({
      user_id: null,
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
      npc: true,
    });
    expect(charList[1]).toMatchObject({
      user_id: user.id,
      name: 'Nosferatu',
      experience: 999,
      file: 'nosferatu.pdf',
      npc: false,
    });
  });

  it('Should be able get a list of NPCs character sheets only', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await fakeCharactersRepository.create({
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
      npc: true,
    });

    await fakeCharactersRepository.create({
      user_id: user.id,
      name: 'Nosferatu',
      experience: 999,
      file: 'nosferatu.pdf',
      situation: 'inactive',
      npc: false,
    });

    const charList = await getCharactersList.execute({
      user_id: user.id,
      filter: 'npc',
    });

    expect(charList).toHaveLength(1);
    expect(charList[0]).toMatchObject({
      user_id: null,
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
      npc: true,
    });
  });

  it('Should be able get a list of PCs character sheets only', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await fakeCharactersRepository.create({
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
      npc: true,
    });

    await fakeCharactersRepository.create({
      user_id: user.id,
      name: 'Nosferatu',
      experience: 999,
      file: 'nosferatu.pdf',
      situation: 'inactive',
      npc: false,
    });

    const charList = await getCharactersList.execute({
      user_id: user.id,
      filter: 'pc',
    });

    expect(charList).toHaveLength(1);
    expect(charList[0]).toMatchObject({
      user_id: user.id,
      name: 'Nosferatu',
      experience: 999,
      file: 'nosferatu.pdf',
      npc: false,
    });
  });

  it('Should not allow invalid users to get character sheets', async () => {
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
      npc: false,
    });

    await expect(
      getCharactersList.execute({
        user_id: 'I am invalid',
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

    await fakeCharactersRepository.create({
      user_id: user.id,
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
      npc: false,
    });

    await expect(
      getCharactersList.execute({
        user_id: nonSTUser.id,
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});
