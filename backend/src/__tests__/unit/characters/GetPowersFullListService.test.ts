import 'reflect-metadata';
import FakePowersRepository from '@modules/characters/repositories/fakes/FakePowersRepository';
import FakeCharactersTraitsRepository from '@modules/characters/repositories/fakes/FakeCharactersTraitsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import GetPowersFullListService from '@modules/characters/services/GetPowersFullListService';
import Power from '@modules/characters/infra/typeorm/entities/Power';

import getMockedTraitsList from './samples/getMockedTraitsList';

let fakeUsersRepository: FakeUsersRepository;
let fakeCharactersTraitsRepository: FakeCharactersTraitsRepository;
let fakePowersRepository: FakePowersRepository;
let getPowersFullList: GetPowersFullListService;

let fakeCharactersRepository: FakeCharactersRepository;

describe('GetPowersFullList', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCharactersTraitsRepository = new FakeCharactersTraitsRepository();
    fakePowersRepository = new FakePowersRepository();
    fakeCharactersRepository = new FakeCharactersRepository();

    getPowersFullList = new GetPowersFullListService(
      fakePowersRepository,
      fakeCharactersTraitsRepository,
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
      user_id: user.id,
      name: 'Unknown',
      experience: 333,
      file: 'unknown.pdf',
      creature_type: 'Unknown',
      npc: true,
    });

    const char4 = await fakeCharactersRepository.create({
      user_id: user.id,
      name: 'Retainer',
      experience: 111,
      file: 'retainer.pdf',
      creature_type: 'Mortal',
      clan: 'Ghoul: Ventrue',
      npc: true,
    });

    const char5 = await fakeCharactersRepository.create({
      user_id: user.id,
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

    const traitsListOutput = await getPowersFullList.execute(user.id);

    expect(traitsListOutput).toHaveLength(12);
    expect(
      traitsListOutput.filter(power => power.long_name === 'Animalism'),
    ).toHaveLength(3);
    expect(
      traitsListOutput.filter(power => power.long_name === 'Argos'),
    ).toHaveLength(2);
    expect(
      traitsListOutput.filter(power => power.long_name === 'Auspex'),
    ).toHaveLength(2);
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
      user_id: user.id,
      name: 'Lupine',
      experience: 111,
      file: 'lupine.pdf',
      creature_type: 'Werewolf',
      npc: true,
    });

    const char2 = await fakeCharactersRepository.create({
      user_id: user.id,
      name: 'Retainer',
      experience: 111,
      file: 'retainer.pdf',
      creature_type: 'Mortal',
      clan: 'Ghoul: Ventrue',
      npc: true,
    });

    const char3 = await fakeCharactersRepository.create({
      user_id: user.id,
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
      type: 'powers',
      origin: 'Brujah',
      requirements: '',
      description: 'Potence rules',
      system: 'Hulk Smash!',
      cost: 3,
      source: 'LotN',
    };

    await fakePowersRepository.create(powerInput);

    const traitsListOutput = await getPowersFullList.execute(user.id);

    expect(traitsListOutput).toHaveLength(4);

    const validPower = traitsListOutput.find(
      power => power.long_name === 'Potence',
    );
    const templatevalidPower: Power = {
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
    } as Power;

    expect(validPower).toMatchObject(templatevalidPower);
  });

  it('Should not allow invalid users to get powers list', async () => {
    await expect(
      getPowersFullList.execute('I am invalid'),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow non storyteller user to get powers list', async () => {
    const nonSTUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'notSTuser@user.com',
      password: '123456',
    });

    await expect(
      getPowersFullList.execute(nonSTUser.id),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  /*

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
  */
});
