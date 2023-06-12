import 'reflect-metadata';
import AppError from '@shared/errors/AppError';

import FakeInfluenceActionsRepository from '@modules/influences/repositories/fakes/FakeInfluenceActionsRepository';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import GetInfluenceActionService from '@modules/influences/services/GetInfluenceActionService';

let fakeInfluenceActionsRepository: FakeInfluenceActionsRepository;
let fakeCharactersRepository: FakeCharactersRepository;
let fakeUsersRepository: FakeUsersRepository;

let getInfluenceAction: GetInfluenceActionService;

describe('GetInfluenceAction', () => {
  beforeEach(() => {
    fakeInfluenceActionsRepository = new FakeInfluenceActionsRepository();
    fakeCharactersRepository = new FakeCharactersRepository();
    fakeUsersRepository = new FakeUsersRepository();

    getInfluenceAction = new GetInfluenceActionService(
      fakeInfluenceActionsRepository,
      fakeCharactersRepository,
      fakeUsersRepository,
    );
  });

  it('Should be able to get an influence action', async () => {
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

    const infAction = await fakeInfluenceActionsRepository.create({
      title: 'Action Title',
      action_period: '2023-06',
      backgrounds: 'Resources x5',
      influence: 'Occult',
      influence_level: 3,
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

    const infActionResult = await getInfluenceAction.execute({
      user_id: user.id,
      action_id: infAction.id,
    });

    expect(infActionResult).toMatchObject(infAction);
  });

  it('Should be able to get an influence action from any character as storyteller', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: false,
    });

    const stUser = await fakeUsersRepository.create({
      name: 'A Storyteller',
      email: 'stuser@user.com',
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

    const infAction = await fakeInfluenceActionsRepository.create({
      title: 'Action Title',
      action_period: '2023-06',
      backgrounds: 'Resources x5',
      influence: 'Occult',
      influence_level: 3,
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
      storyteller_id: stUser.id,
    });

    const infActionResult = await getInfluenceAction.execute({
      user_id: stUser.id,
      action_id: infAction.id,
    });

    expect(infActionResult).toMatchObject(infAction);
  });

  it('Should not allow a non existant user to get an influence action', async () => {
    await expect(
      getInfluenceAction.execute({
        user_id: 'I do not exist',
        action_id: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow get a non existant influence action', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: false,
    });

    await expect(
      getInfluenceAction.execute({
        user_id: user.id,
        action_id: 'I do not exist',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow to get an influence action of a non existant character', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: false,
    });

    const infAction = await fakeInfluenceActionsRepository.create({
      title: 'Action Title',
      action_period: '2023-06',
      backgrounds: 'Resources x5',
      influence: 'Occult',
      influence_level: 3,
      ability: 'Investigation',
      ability_level: 2,
      endeavor: 'attack',
      character_id: 'I do not exist',
      action_owner_id: 'Does not matter',
      action: 'Attack action',
      action_force: 7,
      status: 'read',
      result: 'success',
      st_reply: 'Storyteller reply',
      news: 'My news',
      storyteller_id: 'Does not matter',
    });

    await expect(
      getInfluenceAction.execute({
        user_id: user.id,
        action_id: infAction.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Should not allow a user to get an influence action of other user's character", async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: false,
    });

    const char = await fakeCharactersRepository.create({
      user_id: 'I am not yours',
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
      npc: false,
    });

    const infAction = await fakeInfluenceActionsRepository.create({
      title: 'Action Title',
      action_period: '2023-06',
      backgrounds: 'Resources x5',
      influence: 'Occult',
      influence_level: 3,
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

    await expect(
      getInfluenceAction.execute({
        user_id: user.id,
        action_id: infAction.id,
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});
