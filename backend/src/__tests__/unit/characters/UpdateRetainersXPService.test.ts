import 'reflect-metadata';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import UpdateRetainerXPService from '@modules/characters/services/UpdateRetainerXPService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeCharactersRepository: FakeCharactersRepository;
let updateRetainerXP: UpdateRetainerXPService;

describe('UpdateRetainersXPService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCharactersRepository = new FakeCharactersRepository();

    updateRetainerXP = new UpdateRetainerXPService(
      fakeCharactersRepository,
      fakeUsersRepository,
    );
  });

  it('Should be able update all retainers characters of a character', async () => {
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
      experience: 0,
      experience_total: 0,
      file: 'valdomiro.pdf',
      clan: 'Ghoul: Tzimisce',
      npc: true,
      regnant: char.id,
      retainer_level: 3,
    });

    const charRetainer2 = await fakeCharactersRepository.create({
      name: 'Valdomirão',
      experience: 0,
      experience_total: 0,
      file: 'valdomirao.pdf',
      clan: 'Mortal Retainer',
      npc: true,
      regnant: char.id,
      retainer_level: 2,
    });

    await updateRetainerXP.execute({
      user_id: user.id,
      char_id: char.id,
      situation: 'active',
    });

    const finalList = await fakeCharactersRepository.listRetainers(char.id);

    expect(finalList).toHaveLength(2);
    expect(finalList[0]).toMatchObject({
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
    expect(finalList[1]).toMatchObject({
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

  it('Should skip PC retainers or retainers already updated', async () => {
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
      user_id: user.id,
      name: 'Valdomiro Troca Tiro',
      experience: 0,
      experience_total: 0,
      file: 'valdomiro.pdf',
      clan: 'Ghoul: Tzimisce',
      npc: false,
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

    await updateRetainerXP.execute({
      user_id: user.id,
      char_id: char.id,
      situation: 'active',
    });

    const finalList = await fakeCharactersRepository.listRetainers(char.id);

    expect(finalList).toHaveLength(2);
    expect(finalList[0]).toMatchObject({
      user_id: user.id,
      id: charRetainer1.id,
      name: charRetainer1.name,
      experience: 0,
      experience_total: 0,
      file: 'valdomiro.pdf',
      npc: false,
      regnant: char.id,
      retainer_level: 3,
    });
    expect(finalList[1]).toMatchObject({
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

  it('Should be allow invalid users to update retainers XP', async () => {
    await expect(
      updateRetainerXP.execute({
        user_id: 'I am invalid',
        char_id: 'Does not matter',
        situation: 'active',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not be able to update retainers non existant character', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      updateRetainerXP.execute({
        user_id: user.id,
        char_id: 'I do not exist',
        situation: 'active',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow non storyteller user to update retainers of other player character', async () => {
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
      updateRetainerXP.execute({
        user_id: noSTuser.id,
        char_id: char.id,
        situation: 'active',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});
