import 'reflect-metadata';
import AppError from '@shared/errors/AppError';

import InfluenceAction from '@modules/influences/infra/typeorm/entities/InfluenceAction';
import User from '@modules/users/infra/typeorm/entities/User';
import Character from '@modules/characters/infra/typeorm/entities/Character';

import FakeInfluenceActionsRepository from '@modules/influences/repositories/fakes/FakeInfluenceActionsRepository';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import FakeCharactersTraitsRepository from '@modules/characters/repositories/fakes/FakeCharactersTraitsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import UpdateInfluenceActionService from '@modules/influences/services/UpdateInfluenceActionService';

let fakeInfluenceActionsRepository: FakeInfluenceActionsRepository;
let fakeCharactersRepository: FakeCharactersRepository;
let fakeCharactersTraitsRepository: FakeCharactersTraitsRepository;
let fakeUsersRepository: FakeUsersRepository;

let updateInfluenceAction: UpdateInfluenceActionService;

let user: User;
let char: Character;
let infAction: InfluenceAction;

describe('UpdateInfluenceAction', () => {
  beforeEach(async () => {
    fakeInfluenceActionsRepository = new FakeInfluenceActionsRepository();
    fakeCharactersRepository = new FakeCharactersRepository();
    fakeCharactersTraitsRepository = new FakeCharactersTraitsRepository();
    fakeUsersRepository = new FakeUsersRepository();

    updateInfluenceAction = new UpdateInfluenceActionService(
      fakeInfluenceActionsRepository,
      fakeCharactersRepository,
      fakeCharactersTraitsRepository,
      fakeUsersRepository,
    );

    user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: false,
    });

    char = await fakeCharactersRepository.create({
      user_id: user.id,
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
      npc: false,
    });

    infAction = await fakeInfluenceActionsRepository.create({
      title: 'Action Title',
      action_period: '2023-06',
      backgrounds: 'Resources x5',
      influence: 'Occult',
      influence_level: 3,
      influence_effetive_level: 5,
      ability: 'Investigation',
      ability_level: 2,
      endeavor: 'attack',
      character_id: char.id,
      action_owner_id: char.id,
      action: 'Attack action',
      action_force: 7,
      status: 'read',
      result: 'not evaluated',
    });
  });

  it('Should be able to update an influence action', async () => {
    await fakeCharactersTraitsRepository.createList([
      {
        trait: 'Morality: Humanity',
        character_id: char.id,
        level: 2,
        type: 'virtues',
      },
      {
        trait: 'Occult',
        character_id: char.id,
        level: 5,
        type: 'abilities',
      },
    ]);

    const updatedAction = await updateInfluenceAction.execute({
      user_id: user.id,
      action_id: infAction.id,
      title: 'Update Action Title',
      action_period: '2023-07',
      influence: 'Church',
      ability: 'Occult',
      ability_level: 4,
      influence_level: 4,
      influence_effetive_level: 6,
      character_id: char.id,
      action_owner_id: undefined,
      action: 'New attack action',
    });

    const actionTemplate: InfluenceAction = {
      id: infAction.id,
      title: 'Update Action Title',
      action_period: '2023-07',
      backgrounds: 'Resources x5',
      influence: 'Church',
      influence_level: 4,
      influence_effetive_level: 6,
      ability: 'Occult',
      ability_level: 4,
      endeavor: 'attack',
      character_id: char.id,
      action_owner_id: char.id,
      action: 'New attack action',
      action_force: 12,
      status: 'sent',
      result: 'not evaluated',
    } as InfluenceAction;

    expect(updatedAction).toMatchObject(actionTemplate);
  });

  it('Should be able to update an influence action as defense', async () => {
    await fakeCharactersTraitsRepository.createList([
      {
        trait: 'Morality: Humanity',
        character_id: char.id,
        level: 2,
        type: 'virtues',
      },
      {
        trait: 'Occult',
        character_id: char.id,
        level: 5,
        type: 'abilities',
      },
    ]);

    const updatedAction = await updateInfluenceAction.execute({
      user_id: user.id,
      action_id: infAction.id,
      title: 'Update Action Title',
      action_period: '2023-07',
      backgrounds: 'Allies x5',
      influence: 'Church',
      influence_level: 4,
      influence_effetive_level: 6,
      endeavor: 'defend',
      character_id: char.id,
      action_owner_id: undefined,
      action: 'Defend action',
    });

    const actionTemplate: InfluenceAction = {
      id: infAction.id,
      title: 'Update Action Title',
      action_period: '2023-07',
      backgrounds: '',
      influence: 'Church',
      influence_level: 4,
      influence_effetive_level: 6,
      ability: 'Theology',
      ability_level: 0,
      endeavor: 'defend',
      character_id: char.id,
      action_owner_id: char.id,
      action: '',
      action_force: 14,
      status: 'sent',
      result: 'not evaluated',
    } as InfluenceAction;

    expect(updatedAction).toMatchObject(actionTemplate);
  });

  it('Should be able to update an influence action as defense without key ability', async () => {
    await fakeCharactersTraitsRepository.createList([
      {
        trait: 'Morality: Humanity',
        character_id: char.id,
        level: 2,
        type: 'virtues',
      },
      {
        trait: 'Theology',
        character_id: char.id,
        level: 1,
        type: 'abilities',
      },
      {
        trait: 'Theology',
        character_id: char.id,
        level: 4,
        type: 'abilities',
      },
      {
        trait: 'Theology',
        character_id: char.id,
        level: 2,
        type: 'abilities',
      },
      {
        trait: 'Theology',
        character_id: char.id,
        level: 3,
        type: 'abilities',
      },
    ]);

    const updatedAction = await updateInfluenceAction.execute({
      user_id: user.id,
      action_id: infAction.id,
      title: 'Update Action Title',
      action_period: '2023-07',
      backgrounds: 'Allies x5',
      influence: 'Church',
      influence_level: 4,
      influence_effetive_level: 6,
      endeavor: 'defend',
      character_id: char.id,
      action_owner_id: undefined,
      action: 'Defend action',
    });

    const actionTemplate: InfluenceAction = {
      id: infAction.id,
      title: 'Update Action Title',
      action_period: '2023-07',
      backgrounds: '',
      influence: 'Church',
      influence_level: 4,
      influence_effetive_level: 6,
      ability: 'Theology',
      ability_level: 4,
      endeavor: 'defend',
      character_id: char.id,
      action_owner_id: char.id,
      action: '',
      action_force: 18,
      status: 'sent',
      result: 'not evaluated',
    } as InfluenceAction;

    expect(updatedAction).toMatchObject(actionTemplate);
  });

  it('Should be able to update an influence action with no ability level', async () => {
    await fakeCharactersTraitsRepository.createList([
      {
        trait: 'Morality: Humanity',
        character_id: char.id,
        level: 2,
        type: 'virtues',
      },
    ]);

    const updatedAction = await updateInfluenceAction.execute({
      user_id: user.id,
      action_id: infAction.id,
      title: 'Update Action Title',
      action_period: '2023-07',
      backgrounds: 'Allies x5',
      influence: 'Church',
      influence_level: 4,
      influence_effetive_level: 6,
      ability: 'Firearms',
      ability_level: undefined,
      endeavor: 'attack',
      character_id: char.id,
      action_owner_id: undefined,
      action: 'New attack action',
    });

    const actionTemplate: InfluenceAction = {
      id: expect.any(String),
      title: 'Update Action Title',
      action_period: '2023-07',
      backgrounds: 'Allies x5',
      influence: 'Church',
      influence_level: 4,
      influence_effetive_level: 6,
      ability: 'Firearms',
      ability_level: 0,
      endeavor: 'attack',
      character_id: char.id,
      action_owner_id: char.id,
      action: 'New attack action',
      action_force: 8,
      status: 'sent',
      result: 'not evaluated',
    } as InfluenceAction;

    expect(updatedAction).toMatchObject(actionTemplate);
  });

  it('Should be able to update an influence action with no ability', async () => {
    await fakeCharactersTraitsRepository.createList([
      {
        trait: 'Morality: Humanity',
        character_id: char.id,
        level: 2,
        type: 'virtues',
      },
    ]);

    const updatedAction = await updateInfluenceAction.execute({
      user_id: user.id,
      action_id: infAction.id,
      title: 'Update Action Title',
      action_period: '2023-07',
      backgrounds: 'Allies x5',
      influence: 'Church',
      influence_level: 4,
      influence_effetive_level: 6,
      ability: undefined,
      ability_level: undefined,
      endeavor: 'attack',
      character_id: char.id,
      action_owner_id: undefined,
      action: 'New attack action',
    });

    const actionTemplate: InfluenceAction = {
      id: expect.any(String),
      title: 'Update Action Title',
      action_period: '2023-07',
      backgrounds: 'Allies x5',
      influence: 'Church',
      influence_level: 4,
      influence_effetive_level: 6,
      ability: 'Theology',
      ability_level: 0,
      endeavor: 'attack',
      character_id: char.id,
      action_owner_id: char.id,
      action: 'New attack action',
      action_force: 8,
      status: 'sent',
      result: 'not evaluated',
    } as InfluenceAction;

    expect(updatedAction).toMatchObject(actionTemplate);
  });

  it('Should be able to update an influence action with no morality', async () => {
    await fakeCharactersTraitsRepository.createList([
      {
        trait: 'Occult',
        character_id: char.id,
        level: 5,
        type: 'abilities',
      },
    ]);

    const updatedAction = await updateInfluenceAction.execute({
      user_id: user.id,
      action_id: infAction.id,
      title: 'Update Action Title',
      action_period: '2023-07',
      influence: 'Church',
      ability: 'Occult',
      ability_level: 4,
      influence_level: 4,
      influence_effetive_level: 6,
      character_id: char.id,
      action_owner_id: undefined,
      action: 'New attack action',
    });

    const actionTemplate: InfluenceAction = {
      id: infAction.id,
      title: 'Update Action Title',
      action_period: '2023-07',
      backgrounds: 'Resources x5',
      influence: 'Church',
      influence_level: 4,
      influence_effetive_level: 6,
      ability: 'Occult',
      ability_level: 4,
      endeavor: 'attack',
      character_id: char.id,
      action_owner_id: char.id,
      action: 'New attack action',
      action_force: 10,
      status: 'sent',
      result: 'not evaluated',
    } as InfluenceAction;

    expect(updatedAction).toMatchObject(actionTemplate);
  });

  it('Should be able to update an influence action with morality other than humanity (lower than 4)', async () => {
    await fakeCharactersTraitsRepository.createList([
      {
        trait: 'Morality: Path of Typhon',
        character_id: char.id,
        level: 3,
        type: 'virtues',
      },
      {
        trait: 'Occult',
        character_id: char.id,
        level: 5,
        type: 'abilities',
      },
    ]);

    const updatedAction = await updateInfluenceAction.execute({
      user_id: user.id,
      action_id: infAction.id,
      title: 'Update Action Title',
      action_period: '2023-07',
      influence: 'Church',
      ability: 'Occult',
      ability_level: 4,
      influence_level: 4,
      influence_effetive_level: 6,
      character_id: char.id,
      action_owner_id: undefined,
      action: 'New attack action',
    });

    const actionTemplate: InfluenceAction = {
      id: infAction.id,
      title: 'Update Action Title',
      action_period: '2023-07',
      backgrounds: 'Resources x5',
      influence: 'Church',
      influence_level: 4,
      influence_effetive_level: 6,
      ability: 'Occult',
      ability_level: 4,
      endeavor: 'attack',
      character_id: char.id,
      action_owner_id: char.id,
      action: 'New attack action',
      action_force: 11,
      status: 'sent',
      result: 'not evaluated',
    } as InfluenceAction;

    expect(updatedAction).toMatchObject(actionTemplate);
  });

  it('Should be able to update an influence action with morality other than humanity (higher than 3)', async () => {
    await fakeCharactersTraitsRepository.createList([
      {
        trait: 'Morality: Path of Typhon',
        character_id: char.id,
        level: 4,
        type: 'virtues',
      },
      {
        trait: 'Occult',
        character_id: char.id,
        level: 5,
        type: 'abilities',
      },
    ]);

    const updatedAction = await updateInfluenceAction.execute({
      user_id: user.id,
      action_id: infAction.id,
      title: 'Update Action Title',
      action_period: '2023-07',
      influence: 'Church',
      ability: 'Occult',
      ability_level: 4,
      influence_level: 4,
      influence_effetive_level: 6,
      character_id: char.id,
      action_owner_id: undefined,
      action: 'New attack action',
    });

    const actionTemplate: InfluenceAction = {
      id: infAction.id,
      title: 'Update Action Title',
      action_period: '2023-07',
      backgrounds: 'Resources x5',
      influence: 'Church',
      influence_level: 4,
      influence_effetive_level: 6,
      ability: 'Occult',
      ability_level: 4,
      endeavor: 'attack',
      character_id: char.id,
      action_owner_id: char.id,
      action: 'New attack action',
      action_force: 12,
      status: 'sent',
      result: 'not evaluated',
    } as InfluenceAction;

    expect(updatedAction).toMatchObject(actionTemplate);
  });

  it('Should be able to update an influence action with new morality rules', async () => {
    await fakeCharactersTraitsRepository.createList([
      {
        trait: 'Morality: Humanity',
        character_id: char.id,
        level: 8,
        type: 'virtues',
        updated_at: new Date('2023-06-01T00:00:00.000Z'),
      },
      {
        trait: 'Occult',
        character_id: char.id,
        level: 5,
        type: 'abilities',
      },
    ]);

    const updatedAction = await updateInfluenceAction.execute({
      user_id: user.id,
      action_id: infAction.id,
      title: 'Update Action Title',
      action_period: '2023-07',
      influence: 'Church',
      ability: 'Occult',
      ability_level: 4,
      influence_level: 4,
      influence_effetive_level: 6,
      character_id: char.id,
      action_owner_id: undefined,
      action: 'New attack action',
    });

    const actionTemplate: InfluenceAction = {
      id: infAction.id,
      title: 'Update Action Title',
      action_period: '2023-07',
      backgrounds: 'Resources x5',
      influence: 'Church',
      influence_level: 4,
      influence_effetive_level: 6,
      ability: 'Occult',
      ability_level: 4,
      endeavor: 'attack',
      character_id: char.id,
      action_owner_id: char.id,
      action: 'New attack action',
      action_force: 14,
      status: 'sent',
      result: 'not evaluated',
    } as InfluenceAction;

    expect(updatedAction).toMatchObject(actionTemplate);
  });

  it('Should be able to update an influence action with new morality rules but level 1', async () => {
    await fakeCharactersTraitsRepository.createList([
      {
        trait: 'Morality: Humanity',
        character_id: char.id,
        level: 1,
        type: 'virtues',
        updated_at: new Date('2023-06-01T00:00:00.000Z'),
      },
      {
        trait: 'Occult',
        character_id: char.id,
        level: 5,
        type: 'abilities',
      },
    ]);

    const updatedAction = await updateInfluenceAction.execute({
      user_id: user.id,
      action_id: infAction.id,
      title: 'Update Action Title',
      action_period: '2023-07',
      influence: 'Church',
      ability: 'Occult',
      ability_level: 4,
      influence_level: 4,
      influence_effetive_level: 6,
      character_id: char.id,
      action_owner_id: undefined,
      action: 'New attack action',
    });

    const actionTemplate: InfluenceAction = {
      id: infAction.id,
      title: 'Update Action Title',
      action_period: '2023-07',
      backgrounds: 'Resources x5',
      influence: 'Church',
      influence_level: 4,
      influence_effetive_level: 6,
      ability: 'Occult',
      ability_level: 4,
      endeavor: 'attack',
      character_id: char.id,
      action_owner_id: char.id,
      action: 'New attack action',
      action_force: 11,
      status: 'sent',
      result: 'not evaluated',
    } as InfluenceAction;

    expect(updatedAction).toMatchObject(actionTemplate);
  });

  it('Should be able to update an influence action with a retainer acting', async () => {
    const charRetainer = await fakeCharactersRepository.create({
      name: 'Igor',
      experience: 20,
      file: 'igor.pdf',
      npc: true,
      regnant: char.id,
    });

    await fakeCharactersTraitsRepository.createList([
      {
        trait: 'Morality: Humanity',
        character_id: char.id,
        level: 2,
        type: 'virtues',
      },
      {
        trait: 'Occult',
        character_id: char.id,
        level: 5,
        type: 'abilities',
      },
    ]);

    const updatedAction = await updateInfluenceAction.execute({
      user_id: user.id,
      action_id: infAction.id,
      title: 'Update Action Title',
      action_period: '2023-07',
      influence: 'Church',
      ability: 'Occult',
      ability_level: 4,
      influence_level: 4,
      influence_effetive_level: 6,
      character_id: char.id,
      action_owner_id: charRetainer.id,
      action: 'New attack action',
    });

    const actionTemplate: InfluenceAction = {
      id: infAction.id,
      title: 'Update Action Title',
      action_period: '2023-07',
      backgrounds: 'Resources x5',
      influence: 'Church',
      influence_level: 4,
      influence_effetive_level: 6,
      ability: 'Occult',
      ability_level: 4,
      endeavor: 'attack',
      character_id: char.id,
      action_owner_id: charRetainer.id,
      action: 'New attack action',
      action_force: 12,
      status: 'sent',
      result: 'not evaluated',
    } as InfluenceAction;

    expect(updatedAction).toMatchObject(actionTemplate);
  });

  it('should not allow invalid users to update an influence action', async () => {
    await expect(
      updateInfluenceAction.execute({
        user_id: 'I am invalid',
        action_id: infAction.id,
        title: 'Does not matter',
        action_period: 'Does not matter',
        influence: 'Does not matter',
        influence_level: 0,
        influence_effetive_level: 0,
        character_id: 'Does not matter',
        action_owner_id: 'Does not matter',
        action: 'New attack action',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('should not allow to update a non existant influence action', async () => {
    await expect(
      updateInfluenceAction.execute({
        user_id: user.id,
        action_id: 'I do not exist',
        title: 'Does not matter',
        action_period: 'Does not matter',
        influence: 'Does not matter',
        influence_level: 0,
        influence_effetive_level: 0,
        character_id: 'Does not matter',
        action_owner_id: 'Does not matter',
        action: 'New attack action',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not allow to update an influence action already reviewed by a storyteller', async () => {
    const reviewedAction = await fakeInfluenceActionsRepository.create({
      title: 'Action Title',
      action_period: '2023-06',
      backgrounds: 'Resources x5',
      influence: 'Occult',
      influence_level: 3,
      influence_effetive_level: 6,
      ability: 'Investigation',
      ability_level: 2,
      endeavor: 'attack',
      character_id: char.id,
      action_owner_id: char.id,
      action: 'Attack action',
      action_force: 7,
      status: 'replied',
      result: 'success',
      st_reply: 'Seems good',
      news: 'No news',
      storyteller_id: 'A ST id',
    });

    await expect(
      updateInfluenceAction.execute({
        user_id: user.id,
        action_id: reviewedAction.id,
        title: 'Does not matter',
        action_period: 'Does not matter',
        influence: 'Does not matter',
        influence_level: 0,
        influence_effetive_level: 0,
        character_id: 'Does not matter',
        action_owner_id: 'Does not matter',
        action: 'New attack action',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not allow non existant characters to update an influence action', async () => {
    await expect(
      updateInfluenceAction.execute({
        user_id: user.id,
        action_id: infAction.id,
        title: 'Does not matter',
        action_period: 'Does not matter',
        influence: 'Does not matter',
        influence_level: 0,
        influence_effetive_level: 0,
        character_id: 'I do not exist',
        action_owner_id: 'Does not matter',
        action: 'New attack action',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not allow a user to update an influence action for a character other than his own', async () => {
    const otherUserChar = await fakeCharactersRepository.create({
      user_id: 'I am not the owner',
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
      npc: false,
    });

    await expect(
      updateInfluenceAction.execute({
        user_id: user.id,
        action_id: infAction.id,
        title: 'Does not matter',
        action_period: 'Does not matter',
        influence: 'Does not matter',
        influence_level: 0,
        influence_effetive_level: 0,
        character_id: otherUserChar.id,
        action_owner_id: 'Does not matter',
        action: 'New attack action',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('should not allow a user to update an influence action with a non existant action owner', async () => {
    await expect(
      updateInfluenceAction.execute({
        user_id: user.id,
        action_id: infAction.id,
        title: 'Does not matter',
        action_period: 'Does not matter',
        influence: 'Does not matter',
        influence_level: 0,
        influence_effetive_level: 0,
        character_id: char.id,
        action_owner_id: 'I do not exist',
        action: 'New attack action',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not allow a user to update an influence action with action owner that is not his character's retainer", async () => {
    const charRetainer = await fakeCharactersRepository.create({
      name: 'Igor',
      experience: 20,
      file: 'igor.pdf',
      npc: true,
      regnant: 'I am not yours',
    });

    await expect(
      updateInfluenceAction.execute({
        user_id: user.id,
        action_id: infAction.id,
        title: 'Does not matter',
        action_period: 'Does not matter',
        influence: 'Does not matter',
        influence_level: 0,
        influence_effetive_level: 0,
        character_id: char.id,
        action_owner_id: charRetainer.id,
        action: 'New attack action',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});
