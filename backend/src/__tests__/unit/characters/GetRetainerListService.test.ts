import 'reflect-metadata';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import GetRetainerListService from '@modules/characters/services/GetRetainerListService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeCharactersRepository: FakeCharactersRepository;
let getRetainerList: GetRetainerListService;

describe('GetRetainerListService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCharactersRepository = new FakeCharactersRepository();

    getRetainerList = new GetRetainerListService(
      fakeCharactersRepository,
      fakeUsersRepository,
    );
  });

  it('Should be able to get a list of all retainers characters sheet', async () => {
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

    const charRetainer1 = await fakeCharactersRepository.create({
      name: 'Valdomiro Troca Tiro',
      experience: 67,
      experience_total: 67,
      file: 'valdomiro.pdf',
      clan: 'Ghoul: Tzimisce',
      npc: true,
      regnant: char.id,
      retainer_level: 3,
    });

    const charRetainer2 = await fakeCharactersRepository.create({
      name: 'Valdomirão',
      experience: 33,
      experience_total: 33,
      file: 'valdomirao.pdf',
      clan: 'Mortal Retainer',
      npc: true,
      regnant: char.id,
      retainer_level: 2,
    });

    const retainerList = await getRetainerList.execute({
      user_id: user.id,
      char_id: char.id,
      situation: 'active',
    });

    expect(retainerList).toHaveLength(2);
    expect(retainerList[0]).toMatchObject({
      user_id: null,
      id: charRetainer1.id,
      name: charRetainer1.name,
      experience: 67,
      experience_total: 67,
      file: 'valdomiro.pdf',
      npc: true,
      regnant: char.id,
      retainer_level: 3,
    });
    expect(retainerList[1]).toMatchObject({
      user_id: null,
      id: charRetainer2.id,
      name: charRetainer2.name,
      experience: 33,
      experience_total: 33,
      file: 'valdomirao.pdf',
      npc: true,
      regnant: char.id,
      retainer_level: 2,
    });
  });

  it('Should be allow invalid users to get a list of all retainers characters sheet', async () => {
    await expect(
      getRetainerList.execute({
        user_id: 'I am invalid',
        char_id: 'Does not matter',
        situation: 'active',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not be able to get a retainer list for non existant character', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      getRetainerList.execute({
        user_id: user.id,
        char_id: 'I do not exist',
        situation: 'active',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow non storyteller user get list of retainers of other player character', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const noSTuser = await fakeUsersRepository.create({
      name: 'No ST User',
      email: 'noSTUser@user.com',
      password: '123456',
      storyteller: false,
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

    await fakeCharactersRepository.create({
      name: 'Valdomiro Troca Tiro',
      experience: 0,
      experience_total: 0,
      file: 'valdomiro.pdf',
      clan: 'Ghoul: Tzimisce',
      npc: true,
      regnant: char.id,
      retainer_level: 3,
    });

    await expect(
      getRetainerList.execute({
        user_id: noSTuser.id,
        char_id: char.id,
        situation: 'active',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});
