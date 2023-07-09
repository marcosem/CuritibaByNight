import 'reflect-metadata';
import AppError from '@shared/errors/AppError';

import FakeInfluenceActionsRepository from '@modules/influences/repositories/fakes/FakeInfluenceActionsRepository';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import RemoveInfluenceActionService from '@modules/influences/services/RemoveInfluenceActionService';

let fakeInfluenceActionsRepository: FakeInfluenceActionsRepository;
let fakeCharactersRepository: FakeCharactersRepository;
let fakeUsersRepository: FakeUsersRepository;

let removeInfluenceAction: RemoveInfluenceActionService;

describe('RemoveInfluenceAction', () => {
  beforeEach(() => {
    fakeInfluenceActionsRepository = new FakeInfluenceActionsRepository();
    fakeCharactersRepository = new FakeCharactersRepository();
    fakeUsersRepository = new FakeUsersRepository();

    removeInfluenceAction = new RemoveInfluenceActionService(
      fakeInfluenceActionsRepository,
      fakeCharactersRepository,
      fakeUsersRepository,
    );
  });

  it('Should be able to remove an influence action of his own character', async () => {
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
      influence_effective_level: 5,
      ability: 'Investigation',
      ability_level: 2,
      endeavor: 'attack',
      character_id: char.id,
      action_owner_id: char.id,
      action: 'Attack action',
      action_force: 7,
      status: 'sent',
      result: 'not evaluated',
    });

    const beforeRemove = await fakeInfluenceActionsRepository.listAll();

    await removeInfluenceAction.execute({
      user_id: user.id,
      action_id: infAction.id,
    });

    const afterRemove = await fakeInfluenceActionsRepository.listAll();

    expect(afterRemove).toHaveLength(beforeRemove.length - 1);
  });

  it('Should be able to remove an influence action of any character as storyteller', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A ST User',
      email: 'stUser@user.com',
      password: '123456',
      storyteller: true,
    });

    const infAction = await fakeInfluenceActionsRepository.create({
      title: 'Action Title',
      action_period: '2023-06',
      backgrounds: 'Resources x5',
      influence: 'Occult',
      influence_level: 3,
      influence_effective_level: 5,
      ability: 'Investigation',
      ability_level: 2,
      endeavor: 'attack',
      character_id: 'Not mine character',
      action_owner_id: 'No mine character',
      action: 'Attack action',
      action_force: 7,
      status: 'sent',
      result: 'not evaluated',
    });

    const beforeRemove = await fakeInfluenceActionsRepository.listAll();

    await removeInfluenceAction.execute({
      user_id: user.id,
      action_id: infAction.id,
    });

    const afterRemove = await fakeInfluenceActionsRepository.listAll();

    expect(afterRemove).toHaveLength(beforeRemove.length - 1);
  });

  it('Should allow a non storyteller user to remove an already processed influence action', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A ST User',
      email: 'stUser@user.com',
      password: '123456',
      storyteller: true,
    });

    const infAction = await fakeInfluenceActionsRepository.create({
      title: 'Action Title',
      action_period: '2023-06',
      backgrounds: 'Resources x5',
      influence: 'Occult',
      influence_level: 3,
      influence_effective_level: 5,
      ability: 'Investigation',
      ability_level: 2,
      endeavor: 'attack',
      character_id: 'Not mine character',
      action_owner_id: 'Not mine character',
      action: 'Attack action',
      action_force: 7,
      status: 'read',
      result: 'success',
    });

    const beforeRemove = await fakeInfluenceActionsRepository.listAll();

    await removeInfluenceAction.execute({
      user_id: user.id,
      action_id: infAction.id,
    });

    const afterRemove = await fakeInfluenceActionsRepository.listAll();

    expect(afterRemove).toHaveLength(beforeRemove.length - 1);
  });

  it('Should not allow to remove a non existant influence action', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A ST User',
      email: 'stUser@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      removeInfluenceAction.execute({
        user_id: user.id,
        action_id: 'I do not exist',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow a non storyteller user to remove an already processed influence action', async () => {
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
    });

    await expect(
      removeInfluenceAction.execute({
        user_id: user.id,
        action_id: infAction.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Should not allow a non storyteller user to remove an influence action of other user's character", async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: false,
    });

    const char = await fakeCharactersRepository.create({
      user_id: 'Not me',
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
      influence_effective_level: 5,
      ability: 'Investigation',
      ability_level: 2,
      endeavor: 'attack',
      character_id: char.id,
      action_owner_id: char.id,
      action: 'Attack action',
      action_force: 7,
      status: 'sent',
      result: 'not evaluated',
    });

    await expect(
      removeInfluenceAction.execute({
        user_id: user.id,
        action_id: infAction.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow a non storyteller user to remove an influence action of a non existant character', async () => {
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
      influence_effective_level: 5,
      ability: 'Investigation',
      ability_level: 2,
      endeavor: 'attack',
      character_id: 'I do not exist',
      action_owner_id: 'I do not exist',
      action: 'Attack action',
      action_force: 7,
      status: 'sent',
      result: 'not evaluated',
    });

    await expect(
      removeInfluenceAction.execute({
        user_id: user.id,
        action_id: infAction.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow a non existant user to remove an influence action', async () => {
    await expect(
      removeInfluenceAction.execute({
        user_id: 'I do not exist',
        action_id: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});
