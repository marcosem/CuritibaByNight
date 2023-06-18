import 'reflect-metadata';
import AppError from '@shared/errors/AppError';

import InfluenceAction from '@modules/influences/infra/typeorm/entities/InfluenceAction';
import User from '@modules/users/infra/typeorm/entities/User';
import Character from '@modules/characters/infra/typeorm/entities/Character';

import FakeInfluenceActionsRepository from '@modules/influences/repositories/fakes/FakeInfluenceActionsRepository';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import FakeCharactersTraitsRepository from '@modules/characters/repositories/fakes/FakeCharactersTraitsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import CreateInfluenceActionService from '@modules/influences/services/CreateInfluenceActionService';

let fakeInfluenceActionsRepository: FakeInfluenceActionsRepository;
let fakeCharactersRepository: FakeCharactersRepository;
let fakeCharactersTraitsRepository: FakeCharactersTraitsRepository;
let fakeUsersRepository: FakeUsersRepository;

let createInfluenceAction: CreateInfluenceActionService;

let user: User;
let char: Character;

describe('CreateInfluenceAction', () => {
  beforeEach(async () => {
    fakeInfluenceActionsRepository = new FakeInfluenceActionsRepository();
    fakeCharactersRepository = new FakeCharactersRepository();
    fakeCharactersTraitsRepository = new FakeCharactersTraitsRepository();
    fakeUsersRepository = new FakeUsersRepository();

    createInfluenceAction = new CreateInfluenceActionService(
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
  });

  it('Should be able to create an influence action', async () => {
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

    const action = await createInfluenceAction.execute({
      user_id: user.id,
      title: 'Action Title',
      action_period: '2023-06',
      backgrounds: 'Resources x5',
      influence: 'Occult',
      influence_level: 3,
      ability: 'Investigation',
      ability_level: 2,
      endeavor: 'attack',
      character_id: char.id,
      action_owner_id: undefined,
      action: 'Attack action',
    });

    const actionTemplate: InfluenceAction = {
      id: expect.any(String),
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
      status: 'sent',
      result: 'not evaluated',
    } as InfluenceAction;

    expect(action).toMatchObject(actionTemplate);
  });

  it('Should be able to create an influence action for defense', async () => {
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
      {
        trait: 'Occult',
        character_id: char.id,
        level: 1,
        type: 'abilities',
      },
      {
        trait: 'Occult',
        character_id: char.id,
        level: 2,
        type: 'abilities',
      },
      {
        trait: 'Occult',
        character_id: char.id,
        level: 3,
        type: 'abilities',
      },
      {
        trait: 'Occult',
        character_id: char.id,
        level: 4,
        type: 'abilities',
      },
    ]);

    const action = await createInfluenceAction.execute({
      user_id: user.id,
      title: 'Action Title',
      action_period: '2023-06',
      backgrounds: 'Resources x5',
      influence: 'Occult',
      influence_level: 3,
      ability: undefined,
      ability_level: undefined,
      endeavor: 'defend',
      character_id: char.id,
      action_owner_id: undefined,
      action: 'Defend action',
    });

    const actionTemplate: InfluenceAction = {
      id: expect.any(String),
      title: 'Action Title',
      action_period: '2023-06',
      backgrounds: '',
      influence: 'Occult',
      influence_level: 3,
      ability: 'Occult',
      ability_level: 5,
      endeavor: 'defend',
      character_id: char.id,
      action_owner_id: char.id,
      action: '',
      action_force: 13,
      status: 'sent',
      result: 'not evaluated',
    } as InfluenceAction;

    expect(action).toMatchObject(actionTemplate);
  });

  it('Should be able to create an influence action for defense without key ability', async () => {
    await fakeCharactersTraitsRepository.createList([
      {
        trait: 'Morality: Humanity',
        character_id: char.id,
        level: 2,
        type: 'virtues',
      },
    ]);

    const action = await createInfluenceAction.execute({
      user_id: user.id,
      title: 'Action Title',
      action_period: '2023-06',
      backgrounds: 'Resources x5',
      influence: 'Occult',
      influence_level: 3,
      ability: undefined,
      ability_level: undefined,
      endeavor: 'defend',
      character_id: char.id,
      action_owner_id: undefined,
      action: 'Defend action',
    });

    const actionTemplate: InfluenceAction = {
      id: expect.any(String),
      title: 'Action Title',
      action_period: '2023-06',
      backgrounds: '',
      influence: 'Occult',
      influence_level: 3,
      ability: 'Occult',
      ability_level: 0,
      endeavor: 'defend',
      character_id: char.id,
      action_owner_id: char.id,
      action: '',
      action_force: 8,
      status: 'sent',
      result: 'not evaluated',
    } as InfluenceAction;

    expect(action).toMatchObject(actionTemplate);
  });

  it('Should be able to create an influence action with no ability level', async () => {
    await fakeCharactersTraitsRepository.createList([
      {
        trait: 'Morality: Humanity',
        character_id: char.id,
        level: 2,
        type: 'virtues',
      },
    ]);

    const action = await createInfluenceAction.execute({
      user_id: user.id,
      title: 'Action Title',
      action_period: '2023-06',
      backgrounds: 'Resources x5',
      influence: 'Occult',
      influence_level: 3,
      ability: 'Investigation',
      ability_level: undefined,
      endeavor: 'attack',
      character_id: char.id,
      action_owner_id: undefined,
      action: 'Attack action',
    });

    const actionTemplate: InfluenceAction = {
      id: expect.any(String),
      title: 'Action Title',
      action_period: '2023-06',
      backgrounds: 'Resources x5',
      influence: 'Occult',
      influence_level: 3,
      ability: 'Investigation',
      ability_level: 0,
      endeavor: 'attack',
      character_id: char.id,
      action_owner_id: char.id,
      action: 'Attack action',
      action_force: 5,
      status: 'sent',
      result: 'not evaluated',
    } as InfluenceAction;

    expect(action).toMatchObject(actionTemplate);
  });

  it('Should be able to create an influence action with no ability', async () => {
    await fakeCharactersTraitsRepository.createList([
      {
        trait: 'Morality: Humanity',
        character_id: char.id,
        level: 2,
        type: 'virtues',
      },
    ]);

    const action = await createInfluenceAction.execute({
      user_id: user.id,
      title: 'Action Title',
      action_period: '2023-06',
      backgrounds: 'Resources x5',
      influence: 'Occult',
      influence_level: 3,
      ability: undefined,
      ability_level: undefined,
      endeavor: 'attack',
      character_id: char.id,
      action_owner_id: undefined,
      action: 'Attack action',
    });

    const actionTemplate: InfluenceAction = {
      id: expect.any(String),
      title: 'Action Title',
      action_period: '2023-06',
      backgrounds: 'Resources x5',
      influence: 'Occult',
      influence_level: 3,
      ability: 'Occult',
      ability_level: 0,
      endeavor: 'attack',
      character_id: char.id,
      action_owner_id: char.id,
      action: 'Attack action',
      action_force: 5,
      status: 'sent',
      result: 'not evaluated',
    } as InfluenceAction;

    expect(action).toMatchObject(actionTemplate);
  });

  it('Should be able to create an influence action with no morality', async () => {
    await fakeCharactersTraitsRepository.createList([
      {
        trait: 'Occult',
        character_id: char.id,
        level: 5,
        type: 'abilities',
      },
    ]);

    const action = await createInfluenceAction.execute({
      user_id: user.id,
      title: 'Action Title',
      action_period: '2023-06',
      backgrounds: 'Resources x5',
      influence: 'Occult',
      influence_level: 3,
      ability: 'Investigation',
      ability_level: 2,
      endeavor: 'attack',
      character_id: char.id,
      action_owner_id: undefined,
      action: 'Attack action',
    });

    const actionTemplate: InfluenceAction = {
      id: expect.any(String),
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
      action_force: 5,
      status: 'sent',
      result: 'not evaluated',
    } as InfluenceAction;

    expect(action).toMatchObject(actionTemplate);
  });

  it('Should be able to create an influence action with morality other than humanity (lower than 4)', async () => {
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

    const action = await createInfluenceAction.execute({
      user_id: user.id,
      title: 'Action Title',
      action_period: '2023-06',
      backgrounds: 'Resources x5',
      influence: 'Occult',
      influence_level: 3,
      ability: 'Investigation',
      ability_level: 2,
      endeavor: 'attack',
      character_id: char.id,
      action_owner_id: undefined,
      action: 'Attack action',
    });

    const actionTemplate: InfluenceAction = {
      id: expect.any(String),
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
      action_force: 6,
      status: 'sent',
      result: 'not evaluated',
    } as InfluenceAction;

    expect(action).toMatchObject(actionTemplate);
  });

  it('Should be able to create an influence action with morality other than humanity (higher than 3)', async () => {
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

    const action = await createInfluenceAction.execute({
      user_id: user.id,
      title: 'Action Title',
      action_period: '2023-06',
      backgrounds: 'Resources x5',
      influence: 'Occult',
      influence_level: 3,
      ability: 'Investigation',
      ability_level: 2,
      endeavor: 'attack',
      character_id: char.id,
      action_owner_id: undefined,
      action: 'Attack action',
    });

    const actionTemplate: InfluenceAction = {
      id: expect.any(String),
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
      status: 'sent',
      result: 'not evaluated',
    } as InfluenceAction;

    expect(action).toMatchObject(actionTemplate);
  });

  it('Should be able to create an influence action with new morality rules', async () => {
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

    const action = await createInfluenceAction.execute({
      user_id: user.id,
      title: 'Action Title',
      action_period: '2023-06',
      backgrounds: 'Resources x5',
      influence: 'Occult',
      influence_level: 3,
      ability: 'Investigation',
      ability_level: 2,
      endeavor: 'attack',
      character_id: char.id,
      action_owner_id: undefined,
      action: 'Attack action',
    });

    const actionTemplate: InfluenceAction = {
      id: expect.any(String),
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
      action_force: 9,
      status: 'sent',
      result: 'not evaluated',
    } as InfluenceAction;

    expect(action).toMatchObject(actionTemplate);
  });

  it('Should be able to create an influence action with new morality rules but level 1', async () => {
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

    const action = await createInfluenceAction.execute({
      user_id: user.id,
      title: 'Action Title',
      action_period: '2023-06',
      backgrounds: 'Resources x5',
      influence: 'Occult',
      influence_level: 3,
      ability: 'Investigation',
      ability_level: 2,
      endeavor: 'attack',
      character_id: char.id,
      action_owner_id: undefined,
      action: 'Attack action',
    });

    const actionTemplate: InfluenceAction = {
      id: expect.any(String),
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
      action_force: 6,
      status: 'sent',
      result: 'not evaluated',
    } as InfluenceAction;

    expect(action).toMatchObject(actionTemplate);
  });

  it('Should be able to create an influence action with a retainer acting', async () => {
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

    const action = await createInfluenceAction.execute({
      user_id: user.id,
      title: 'Action Title',
      action_period: '2023-06',
      backgrounds: 'Resources x5',
      influence: 'Occult',
      influence_level: 3,
      ability: 'Investigation',
      ability_level: 2,
      endeavor: 'attack',
      character_id: char.id,
      action_owner_id: charRetainer.id,
      action: 'Attack action',
    });

    const actionTemplate: InfluenceAction = {
      id: expect.any(String),
      title: 'Action Title',
      action_period: '2023-06',
      backgrounds: 'Resources x5',
      influence: 'Occult',
      influence_level: 3,
      ability: 'Investigation',
      ability_level: 2,
      endeavor: 'attack',
      character_id: char.id,
      action_owner_id: charRetainer.id,
      action: 'Attack action',
      action_force: 7,
      status: 'sent',
      result: 'not evaluated',
    } as InfluenceAction;

    expect(action).toMatchObject(actionTemplate);
  });

  it('should not allow invalid users to create an influence action', async () => {
    await expect(
      createInfluenceAction.execute({
        user_id: 'I am invalid',
        title: 'Does not matter',
        action_period: 'Does not matter',
        influence: 'Does not matter',
        influence_level: 0,
        endeavor: 'Does not matter',
        character_id: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('should not allow non existant characters to create an influence action', async () => {
    await expect(
      createInfluenceAction.execute({
        user_id: user.id,
        title: 'Does not matter',
        action_period: 'Does not matter',
        influence: 'Does not matter',
        influence_level: 0,
        endeavor: 'Does not matter',
        character_id: 'I do not exist',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not allow a user to create an influence action for a character other than his own', async () => {
    const otherChar = await fakeCharactersRepository.create({
      user_id: 'I am not the owner',
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
      npc: false,
    });

    await expect(
      createInfluenceAction.execute({
        user_id: user.id,
        title: 'Does not matter',
        action_period: 'Does not matter',
        influence: 'Does not matter',
        influence_level: 0,
        endeavor: 'Does not matter',
        character_id: otherChar.id,
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('should not allow a user to create an influence action with a non existant action owner', async () => {
    await expect(
      createInfluenceAction.execute({
        user_id: user.id,
        title: 'Does not matter',
        action_period: 'Does not matter',
        influence: 'Does not matter',
        influence_level: 0,
        endeavor: 'Does not matter',
        character_id: char.id,
        action_owner_id: 'I do not exist',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not allow a user to create an influence action with action owner that is not his character's retainer", async () => {
    const charRetainer = await fakeCharactersRepository.create({
      name: 'Igor',
      experience: 20,
      file: 'igor.pdf',
      npc: true,
      regnant: 'I am not yours',
    });

    await expect(
      createInfluenceAction.execute({
        user_id: user.id,
        title: 'Does not matter',
        action_period: 'Does not matter',
        influence: 'Does not matter',
        influence_level: 0,
        endeavor: 'Does not matter',
        character_id: char.id,
        action_owner_id: charRetainer.id,
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});
