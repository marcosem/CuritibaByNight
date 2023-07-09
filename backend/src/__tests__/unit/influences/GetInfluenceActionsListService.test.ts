import 'reflect-metadata';
import AppError from '@shared/errors/AppError';

import FakeInfluenceActionsRepository from '@modules/influences/repositories/fakes/FakeInfluenceActionsRepository';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import GetInfluenceActionsListService from '@modules/influences/services/GetInfluenceActionsListService';

let fakeInfluenceActionsRepository: FakeInfluenceActionsRepository;
let fakeCharactersRepository: FakeCharactersRepository;
let fakeUsersRepository: FakeUsersRepository;

let getInfluenceActionsList: GetInfluenceActionsListService;

describe('GetInfluenceActionsList', () => {
  beforeEach(async () => {
    fakeInfluenceActionsRepository = new FakeInfluenceActionsRepository();
    fakeCharactersRepository = new FakeCharactersRepository();
    fakeUsersRepository = new FakeUsersRepository();

    getInfluenceActionsList = new GetInfluenceActionsListService(
      fakeInfluenceActionsRepository,
      fakeCharactersRepository,
      fakeUsersRepository,
    );

    await fakeInfluenceActionsRepository.create({
      title: 'Ordinary Action #1',
      action_period: '2023-04',
      backgrounds: 'Allies x2',
      influence: 'Industry',
      influence_level: 1,
      influence_effective_level: 2,
      ability: 'Craft: Brewery',
      ability_level: 2,
      endeavor: 'attack',
      character_id: 'Unknow Char',
      action_owner_id: 'Unknow Char',
      action: 'Attack action',
      action_force: 5,
      status: 'read',
      result: 'success',
      st_reply: 'Storyteller reply',
      news: 'My news',
      storyteller_id: 'Does not matter',
    });

    await fakeInfluenceActionsRepository.create({
      title: 'Ordinary Action #2',
      action_period: '2023-05',
      backgrounds: 'Cult x3',
      influence: 'Street',
      influence_level: 5,
      influence_effective_level: 6,
      ability: 'Firearms',
      ability_level: 5,
      endeavor: 'attack',
      character_id: 'Unknow Char',
      action_owner_id: 'Unknow Char',
      action: 'Attack action',
      action_force: 12,
      status: 'read',
      result: 'success',
      st_reply: 'Storyteller reply',
      news: 'My news',
      storyteller_id: 'Does not matter',
    });
  });

  it('Should be able to get a list of influence actions', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: false,
    });

    const char = await fakeCharactersRepository.create({
      user_id: user.id,
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
      npc: false,
    });

    const infAction1 = await fakeInfluenceActionsRepository.create({
      title: 'Action Title #1',
      action_period: '2023-06',
      backgrounds: 'Resources x5',
      influence: 'Occult',
      influence_level: 3,
      influence_effective_level: 5,
      ability: 'Investigation',
      ability_level: 2,
      endeavor: 'attack',
      character_id: char.id,
      action_owner_id: char.id,
      action: 'Attack action',
      action_force: 7,
      status: 'read',
      result: 'success',
      st_reply: 'Storyteller reply',
      news: 'My news',
      storyteller_id: 'Does not matter',
    });

    const infAction2 = await fakeInfluenceActionsRepository.create({
      title: 'Action Title #2',
      action_period: '2023-06',
      backgrounds: 'Contacts x3',
      influence: 'Health',
      influence_level: 2,
      influence_effective_level: 3,
      ability: 'Melee',
      ability_level: 3,
      endeavor: 'attack',
      character_id: char.id,
      action_owner_id: char.id,
      action: 'Attack action',
      action_force: 7,
      status: 'read',
      result: 'success',
      st_reply: 'Storyteller reply',
      news: 'My news',
      storyteller_id: 'Does not matter',
    });

    const infActionsListResult = await getInfluenceActionsList.execute({
      user_id: user.id,
      char_id: char.id,
    });

    expect(infActionsListResult).toHaveLength(2);
    expect(infActionsListResult).toMatchObject([infAction1, infAction2]);
  });

  it('Should be able to get a list of influence actions per period', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: false,
    });

    const char = await fakeCharactersRepository.create({
      user_id: user.id,
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
      npc: false,
    });

    await fakeInfluenceActionsRepository.create({
      title: 'Action Title #1',
      action_period: '2023-04',
      backgrounds: 'Resources x5',
      influence: 'Occult',
      influence_level: 3,
      influence_effective_level: 5,
      ability: 'Investigation',
      ability_level: 2,
      endeavor: 'attack',
      character_id: char.id,
      action_owner_id: char.id,
      action: 'Attack action',
      action_force: 7,
      status: 'read',
      result: 'success',
      st_reply: 'Storyteller reply',
      news: 'My news',
      storyteller_id: 'Does not matter',
    });

    const infAction = await fakeInfluenceActionsRepository.create({
      title: 'Action Title #2',
      action_period: '2023-05',
      backgrounds: 'Contacts x3',
      influence: 'Health',
      influence_level: 2,
      influence_effective_level: 3,
      ability: 'Melee',
      ability_level: 3,
      endeavor: 'attack',
      character_id: char.id,
      action_owner_id: char.id,
      action: 'Attack action',
      action_force: 7,
      status: 'read',
      result: 'success',
      st_reply: 'Storyteller reply',
      news: 'My news',
      storyteller_id: 'Does not matter',
    });

    const infActionsListResult = await getInfluenceActionsList.execute({
      user_id: user.id,
      char_id: char.id,
      action_period: '2023-05',
    });

    expect(infActionsListResult).toHaveLength(1);
    expect(infActionsListResult).toMatchObject([infAction]);
  });

  it('Should be able to get a list of not replied influence actions', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: false,
    });

    const char = await fakeCharactersRepository.create({
      user_id: user.id,
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
      npc: false,
    });

    await fakeInfluenceActionsRepository.create({
      title: 'Action Title #1',
      action_period: '2023-04',
      backgrounds: 'Resources x5',
      influence: 'Occult',
      influence_level: 3,
      influence_effective_level: 5,
      ability: 'Investigation',
      ability_level: 2,
      endeavor: 'attack',
      character_id: char.id,
      action_owner_id: char.id,
      action: 'Attack action',
      action_force: 7,
      status: 'replied',
      result: 'success',
      st_reply: 'Storyteller reply',
      news: 'My news',
      storyteller_id: 'Does not matter',
    });

    const infAction = await fakeInfluenceActionsRepository.create({
      title: 'Action Title #2',
      action_period: '2023-05',
      backgrounds: 'Contacts x3',
      influence: 'Health',
      influence_level: 2,
      influence_effective_level: 3,
      ability: 'Melee',
      ability_level: 3,
      endeavor: 'attack',
      character_id: char.id,
      action_owner_id: char.id,
      action: 'Attack action',
      action_force: 7,
      status: 'read',
      result: 'success',
      st_reply: 'Storyteller reply',
      news: 'My news',
      storyteller_id: 'Does not matter',
    });

    const infActionsListResult = await getInfluenceActionsList.execute({
      user_id: user.id,
      char_id: char.id,
      pending_only: true,
    });

    expect(infActionsListResult).toHaveLength(1);
    expect(infActionsListResult).toMatchObject([infAction]);
  });

  it('Should be able to get a list of all influence actions', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A ST User',
      email: 'stUser@user.com',
      password: '123456',
      storyteller: true,
    });

    await fakeInfluenceActionsRepository.create({
      title: 'Action Title #1',
      action_period: '2023-06',
      backgrounds: 'Resources x5',
      influence: 'Occult',
      influence_level: 3,
      influence_effective_level: 5,
      ability: 'Investigation',
      ability_level: 2,
      endeavor: 'attack',
      character_id: 'Does not matter',
      action_owner_id: 'Does not matter',
      action: 'Attack action',
      action_force: 7,
      status: 'read',
      result: 'success',
      st_reply: 'Storyteller reply',
      news: 'My news',
      storyteller_id: 'Does not matter',
    });

    await fakeInfluenceActionsRepository.create({
      title: 'Action Title #2',
      action_period: '2023-06',
      backgrounds: 'Contacts x3',
      influence: 'Health',
      influence_level: 2,
      influence_effective_level: 3,
      ability: 'Melee',
      ability_level: 3,
      endeavor: 'attack',
      character_id: 'Does not matter',
      action_owner_id: 'Does not matter',
      action: 'Attack action',
      action_force: 7,
      status: 'read',
      result: 'success',
      st_reply: 'Storyteller reply',
      news: 'My news',
      storyteller_id: 'Does not matter',
    });

    const infActionsListResult = await getInfluenceActionsList.execute({
      user_id: user.id,
    });

    expect(infActionsListResult).toHaveLength(4);
  });

  it('Should be able to get a list of all influence actions per period', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A ST User',
      email: 'stUser@user.com',
      password: '123456',
      storyteller: true,
    });

    await fakeInfluenceActionsRepository.create({
      title: 'Action Title #1',
      action_period: '2023-04',
      backgrounds: 'Resources x5',
      influence: 'Occult',
      influence_level: 3,
      influence_effective_level: 5,
      ability: 'Investigation',
      ability_level: 2,
      endeavor: 'attack',
      character_id: 'Does not matter',
      action_owner_id: 'Does not matter',
      action: 'Attack action',
      action_force: 7,
      status: 'read',
      result: 'success',
      st_reply: 'Storyteller reply',
      news: 'My news',
      storyteller_id: 'Does not matter',
    });

    await fakeInfluenceActionsRepository.create({
      title: 'Action Title #2',
      action_period: '2023-04',
      backgrounds: 'Contacts x3',
      influence: 'Health',
      influence_level: 2,
      influence_effective_level: 3,
      ability: 'Melee',
      ability_level: 3,
      endeavor: 'attack',
      character_id: 'Does not matter',
      action_owner_id: 'Does not matter',
      action: 'Attack action',
      action_force: 7,
      status: 'read',
      result: 'success',
      st_reply: 'Storyteller reply',
      news: 'My news',
      storyteller_id: 'Does not matter',
    });

    const infActionsListResult = await getInfluenceActionsList.execute({
      user_id: user.id,
      action_period: '2023-04',
    });

    expect(infActionsListResult).toHaveLength(3);
  });

  it('Should be able to get a list of all not replied influence actions per period', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A ST User',
      email: 'stUser@user.com',
      password: '123456',
      storyteller: true,
    });

    await fakeInfluenceActionsRepository.create({
      title: 'Action Title #1',
      action_period: '2023-04',
      backgrounds: 'Resources x5',
      influence: 'Occult',
      influence_level: 3,
      influence_effective_level: 5,
      ability: 'Investigation',
      ability_level: 2,
      endeavor: 'attack',
      character_id: 'Does not matter',
      action_owner_id: 'Does not matter',
      action: 'Attack action',
      action_force: 7,
      status: 'replied',
      result: 'success',
      st_reply: 'Storyteller reply',
      news: 'My news',
      storyteller_id: 'Does not matter',
    });

    await fakeInfluenceActionsRepository.create({
      title: 'Action Title #2',
      action_period: '2023-04',
      backgrounds: 'Contacts x3',
      influence: 'Health',
      influence_level: 2,
      influence_effective_level: 3,
      ability: 'Melee',
      ability_level: 3,
      endeavor: 'attack',
      character_id: 'Does not matter',
      action_owner_id: 'Does not matter',
      action: 'Attack action',
      action_force: 7,
      status: 'replied',
      result: 'success',
      st_reply: 'Storyteller reply',
      news: 'My news',
      storyteller_id: 'Does not matter',
    });

    const infActionsListResult = await getInfluenceActionsList.execute({
      user_id: user.id,
      action_period: '2023-04',
      pending_only: true,
    });

    expect(infActionsListResult).toHaveLength(1);
  });

  it('Should not allow a non existant user to get list of influence actions', async () => {
    await expect(
      getInfluenceActionsList.execute({
        user_id: 'I do not exist',
        char_id: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow a non storyteller user to list of all influence actions', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: false,
    });

    await expect(
      getInfluenceActionsList.execute({
        user_id: user.id,
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow to get list of influence actions of a non existant character', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: false,
    });

    await expect(
      getInfluenceActionsList.execute({
        user_id: user.id,
        char_id: 'I do not exist',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Should not allow to get list of influence actions of another user's character", async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: false,
    });

    const char = await fakeCharactersRepository.create({
      user_id: 'Another user',
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
      npc: false,
    });

    await expect(
      getInfluenceActionsList.execute({
        user_id: user.id,
        char_id: char.id,
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});
