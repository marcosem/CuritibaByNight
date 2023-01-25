import 'reflect-metadata';
import FakePowersRepository from '@modules/characters/repositories/fakes/FakePowersRepository';
import FakeCharactersTraitsRepository from '@modules/characters/repositories/fakes/FakeCharactersTraitsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import GetPowersListService from '@modules/characters/services/GetPowersListService';
import Power from '@modules/characters/infra/typeorm/entities/Power';
import AppError from '@shared/errors/AppError';

import getMockedTraitsList from './samples/getMockedTraitsList';

let fakeUsersRepository: FakeUsersRepository;
let fakeCharactersRepository: FakeCharactersRepository;
let fakeCharactersTraitsRepository: FakeCharactersTraitsRepository;
let fakePowersRepository: FakePowersRepository;
let getPowersFullList: GetPowersListService;

describe('GetPowersList', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCharactersRepository = new FakeCharactersRepository();
    fakeCharactersTraitsRepository = new FakeCharactersTraitsRepository();
    fakePowersRepository = new FakePowersRepository();

    getPowersFullList = new GetPowersListService(
      fakePowersRepository,
      fakeCharactersTraitsRepository,
      fakeCharactersRepository,
      fakeUsersRepository,
    );
  });

  it('Should be able to list all powers and rituals from CharactersTraits', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const char1 = await fakeCharactersRepository.create({
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
      clan: 'Ventrue',
      creature_type: 'Vampire',
      npc: true,
    });

    const char2 = await fakeCharactersRepository.create({
      user_id: user.id,
      name: 'Gaspar',
      experience: 999,
      file: 'gaspar.pdf',
      creature_type: 'Wraith',
      npc: false,
    });

    const char3 = await fakeCharactersRepository.create({
      name: 'Unknown',
      experience: 333,
      file: 'unknown.pdf',
      creature_type: 'Unknown',
      npc: true,
    });

    const char4 = await fakeCharactersRepository.create({
      name: 'Retainer',
      experience: 111,
      file: 'retainer.pdf',
      creature_type: 'Mortal',
      clan: 'Ghoul: Ventrue',
      npc: true,
    });

    const char5 = await fakeCharactersRepository.create({
      name: 'Lupine',
      experience: 111,
      file: 'lupine.pdf',
      creature_type: 'Werewolf',
      npc: true,
    });

    const traitsListInput = getMockedTraitsList([
      char1,
      char2,
      char3,
      char4,
      char5,
    ]);
    await fakeCharactersTraitsRepository.createList(traitsListInput);

    const traitsListOutput = await getPowersFullList.execute({
      user_id: user.id,
    });

    expect(traitsListOutput).toHaveLength(16);
    expect(
      traitsListOutput.filter(power => power.long_name === 'Animalism'),
    ).toHaveLength(4);
    expect(
      traitsListOutput.filter(power => power.long_name === 'Argos'),
    ).toHaveLength(3);
    expect(
      traitsListOutput.filter(power => power.long_name === 'Auspex'),
    ).toHaveLength(3);
    expect(
      traitsListOutput.filter(power => power.long_name === 'Custom Power'),
    ).toHaveLength(1);
    expect(
      traitsListOutput.filter(
        power => power.long_name === 'Alter Simple Creature',
      ),
    ).toHaveLength(1);
    expect(
      traitsListOutput.filter(
        power => power.long_name === "Ventrue: Denial of Aphrodite's Favor",
      ),
    ).toHaveLength(1);
    expect(
      traitsListOutput.filter(power => power.long_name === 'Willpower'),
    ).toHaveLength(0);
  });

  it('Should be able to list valid powers together with the ones from CharactersTraits', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const char1 = await fakeCharactersRepository.create({
      name: 'Lupine',
      experience: 111,
      file: 'lupine.pdf',
      creature_type: 'Werewolf',
      npc: true,
    });

    const char2 = await fakeCharactersRepository.create({
      name: 'Retainer',
      experience: 111,
      file: 'retainer.pdf',
      creature_type: 'Mortal',
      clan: 'Ghoul: Ventrue',
      npc: true,
    });

    const char3 = await fakeCharactersRepository.create({
      name: 'Lupine',
      experience: 111,
      file: 'lupine.pdf',
      creature_type: 'Werewolf',
      npc: true,
    });

    const traitsListInput = getMockedTraitsList([char1, char2, char3]);
    await fakeCharactersTraitsRepository.createList(traitsListInput);

    const powerInput = {
      long_name: 'Potence',
      short_name: 'Potence',
      level: 1,
      type: 'discipline',
      origin: 'Brujah',
      requirements: '',
      description: 'Potence rules',
      system: 'Hulk Smash!',
      cost: 3,
      source: 'LotN',
    };

    await fakePowersRepository.create(powerInput);

    const traitsListOutput = await getPowersFullList.execute({
      user_id: user.id,
    });

    expect(traitsListOutput).toHaveLength(6);

    const validPower = traitsListOutput.filter(
      power => power.long_name === 'Potence',
    );

    const templatevalidPower: Power[] = [
      {
        long_name: powerInput.long_name,
        short_name: powerInput.short_name,
        level: 0,
        type: 'powers',
      },
      {
        id: expect.any(String),
        long_name: powerInput.long_name,
        short_name: powerInput.short_name,
        level: powerInput.level,
        type: powerInput.type,
        origin: powerInput.origin,
        requirements: powerInput.requirements,
        description: powerInput.description,
        system: powerInput.system,
        cost: powerInput.cost,
        source: powerInput.source,
      },
    ] as Power[];

    expect(validPower).toMatchObject(templatevalidPower);
  });

  it('Should allow to get the list of powers of his own character', async () => {
    const nonSTUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'notSTuser@user.com',
      password: '123456',
      storyteller: false,
    });

    const theChar = await fakeCharactersRepository.create({
      user_id: nonSTUser.id,
      name: 'Retainer',
      experience: 111,
      file: 'retainer.pdf',
      creature_type: 'Mortal',
      clan: 'Ghoul: Ventrue',
      npc: true,
    });

    const char2 = await fakeCharactersRepository.create({
      name: 'Lupine',
      experience: 111,
      file: 'lupine.pdf',
      creature_type: 'Werewolf',
      npc: true,
    });

    const char3 = await fakeCharactersRepository.create({
      name: 'Lupine',
      experience: 111,
      file: 'lupine.pdf',
      creature_type: 'Werewolf',
      npc: true,
    });

    const traitsListInput = getMockedTraitsList([theChar, char2, char3]);
    await fakeCharactersTraitsRepository.createList(traitsListInput);

    const powerInput = {
      long_name: 'Potence',
      short_name: 'Potence',
      level: 1,
      type: 'discipline',
      origin: 'Brujah',
      requirements: '',
      description: 'Potence rules',
      system: 'Hulk Smash!',
      cost: 3,
      source: 'LotN',
    };

    await fakePowersRepository.create(powerInput);

    const traitsListOutput = await getPowersFullList.execute({
      user_id: nonSTUser.id,
      char_id: theChar.id,
    });

    expect(traitsListOutput).toHaveLength(5);

    const validPower = traitsListOutput.filter(
      power => power.long_name === 'Potence',
    );

    const templatevalidPower: Power[] = [
      {
        long_name: powerInput.long_name,
        short_name: powerInput.short_name,
        level: 0,
        type: 'powers',
      },
      {
        id: expect.any(String),
        long_name: powerInput.long_name,
        short_name: powerInput.short_name,
        level: powerInput.level,
        type: powerInput.type,
        origin: powerInput.origin,
        requirements: powerInput.requirements,
        description: powerInput.description,
        system: powerInput.system,
        cost: powerInput.cost,
        source: powerInput.source,
      },
    ] as Power[];

    expect(validPower).toMatchObject(templatevalidPower);
  });

  it('Should allow Storyteller to get list of powers of others users character', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Storyteller',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const nonSTUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'notSTuser@user.com',
      password: '123456',
      storyteller: false,
    });

    const theChar = await fakeCharactersRepository.create({
      user_id: nonSTUser.id,
      name: 'Retainer',
      experience: 111,
      file: 'retainer.pdf',
      creature_type: 'Mortal',
      clan: 'Ghoul: Ventrue',
      npc: true,
    });

    const char2 = await fakeCharactersRepository.create({
      name: 'Lupine',
      experience: 111,
      file: 'lupine.pdf',
      creature_type: 'Werewolf',
      npc: true,
    });

    const char3 = await fakeCharactersRepository.create({
      name: 'Lupine',
      experience: 111,
      file: 'lupine.pdf',
      creature_type: 'Werewolf',
      npc: true,
    });

    const traitsListInput = getMockedTraitsList([theChar, char2, char3]);
    await fakeCharactersTraitsRepository.createList(traitsListInput);

    const powerInput = {
      long_name: 'Potence',
      short_name: 'Potence',
      level: 1,
      type: 'discipline',
      origin: 'Brujah',
      requirements: '',
      description: 'Potence rules',
      system: 'Hulk Smash!',
      cost: 3,
      source: 'LotN',
    };

    await fakePowersRepository.create(powerInput);

    const traitsListOutput = await getPowersFullList.execute({
      user_id: user.id,
      char_id: theChar.id,
    });

    expect(traitsListOutput).toHaveLength(5);

    const validPower = traitsListOutput.filter(
      power => power.long_name === 'Potence',
    );

    const templatevalidPower: Power[] = [
      {
        long_name: powerInput.long_name,
        short_name: powerInput.short_name,
        level: 0,
        type: 'powers',
      },
      {
        id: expect.any(String),
        long_name: powerInput.long_name,
        short_name: powerInput.short_name,
        level: powerInput.level,
        type: powerInput.type,
        origin: powerInput.origin,
        requirements: powerInput.requirements,
        description: powerInput.description,
        system: powerInput.system,
        cost: powerInput.cost,
        source: powerInput.source,
      },
    ] as Power[];

    expect(validPower).toMatchObject(templatevalidPower);
  });

  it('Should be able to get his own character retainer powers', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: false,
    });

    const char = await fakeCharactersRepository.create({
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
      user_id: user.id,
      clan: 'Ventrue',
      creature_type: 'Vampire',
      npc: false,
    });

    const retainerChar = await fakeCharactersRepository.create({
      name: 'Igor',
      experience: 2,
      file: 'igor.pdf',
      regnant: char.id,
      retainer_level: 2,
      creature_type: 'Mortal',
      clan: 'Ghoul: Ventrue',
      npc: true,
    });

    const traitsListInput = getMockedTraitsList([char, retainerChar]);
    await fakeCharactersTraitsRepository.createList(traitsListInput);

    const traitsListOutput = await getPowersFullList.execute({
      user_id: user.id,
      char_id: retainerChar.id,
    });

    expect(traitsListOutput).toHaveLength(5);
  });

  it('Should not allow a non storyteller player to get powers of other players character', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Storyteller',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const nonSTUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'notSTuser@user.com',
      password: '123456',
      storyteller: false,
    });

    const char = await fakeCharactersRepository.create({
      user_id: user.id,
      name: 'Retainer',
      experience: 111,
      file: 'retainer.pdf',
      creature_type: 'Mortal',
      clan: 'Ghoul: Ventrue',
      npc: true,
    });

    const traitsListInput = getMockedTraitsList([char]);
    await fakeCharactersTraitsRepository.createList(traitsListInput);

    await expect(
      getPowersFullList.execute({
        user_id: nonSTUser.id,
        char_id: char.id,
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow invalid users to get powers list', async () => {
    await expect(
      getPowersFullList.execute({
        user_id: 'I am invalid',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow non storyteller user to get list of all powers', async () => {
    const nonSTUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'notSTuser@user.com',
      password: '123456',
    });

    await expect(
      getPowersFullList.execute({ user_id: nonSTUser.id }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow to get leist of powers of a non existant character', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      getPowersFullList.execute({
        user_id: user.id,
        char_id: 'Does not matter',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
