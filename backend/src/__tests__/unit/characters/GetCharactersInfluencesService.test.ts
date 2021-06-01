import 'reflect-metadata';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import FakeCharactersTraitsRepository from '@modules/characters/repositories/fakes/FakeCharactersTraitsRepository';
import GetCharactersInfluencesService from '@modules/characters/services/GetCharactersInfluencesService';

import characterList from './samples/charactersInfluencesInput';
import charListOutput from './samples/charactersInfluencesOutput';

let fakeUsersRepository: FakeUsersRepository;
let fakeCharactersRepository: FakeCharactersRepository;
let fakeCharactersTraitsRepository: FakeCharactersTraitsRepository;
let getCharacterInfluences: GetCharactersInfluencesService;

const outputTemplate = {
  domain_capacity: expect.any(Number),
  influence_capacity: expect.arrayContaining([
    {
      name: expect.any(String),
      total: expect.any(Number),
      leader_level: expect.any(Number),
      leaders: expect.arrayContaining([
        {
          id: expect.any(String),
          name: expect.any(String),
        },
      ]),
    },
  ]),
  list: expect.arrayContaining([
    {
      character: expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        creature_type: expect.any(String),
        clan: expect.any(String),
        sect: expect.any(String),
        situation: expect.any(String),
        npc: expect.any(Boolean),
        morality: expect.any(String),
        morality_level: expect.any(Number),
        retainers_level_perm: expect.any(Number),
        retainers_level_temp: expect.any(Number),
        attributes: expect.any(Number),
        influence_capacity: expect.any(Number),
        actions: expect.any(Number),
      }),
      influences: expect.arrayContaining([
        {
          name: expect.any(String),
          level_perm: expect.any(Number),
          level_temp: expect.any(Number),
          ability: expect.any(String),
          ability_level: expect.any(Number),
          defense_passive: expect.any(Number),
          defense_active: expect.any(Number),
        },
      ]),
    },
  ]),
};

describe('GetCharactersInfluences', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCharactersRepository = new FakeCharactersRepository();
    fakeCharactersTraitsRepository = new FakeCharactersTraitsRepository();

    getCharacterInfluences = new GetCharactersInfluencesService(
      fakeCharactersTraitsRepository,
      fakeCharactersRepository,
      fakeUsersRepository,
    );
  });

  it('Should be able get a list of characters influences', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const newCharacterList = [];
    await new Promise<void>((resolve, _) => {
      characterList.forEach(async (char, index, myArray) => {
        const newChar = await fakeCharactersRepository.create({
          name: char.name,
          experience: char.experience,
          file: char.file,
          clan: char.clan,
          creature_type: char.creature_type,
          sect: char.sect,
          situation: char.situation,
          npc: char.npc,
        });

        const newTraitList = char.traits.map(trait => {
          const newTrait = {
            trait: trait.trait,
            character_id: newChar.id,
            level: trait.level,
            level_temp:
              trait.level_temp === undefined ? null : trait.level_temp,
            type: trait.type,
          };
          return newTrait;
        });

        await fakeCharactersTraitsRepository.createList(newTraitList);
        newCharacterList.push(newChar);

        if (index === myArray.length - 1) resolve();
      });
    });

    const charInfList = await getCharacterInfluences.execute(user.id);

    expect(charInfList).toMatchObject(outputTemplate);
    expect(charInfList).toMatchObject(charListOutput);
  });
});

it('Should not allow invalid users to get list of characters influences', async () => {
  await expect(
    getCharacterInfluences.execute('I am invalid'),
  ).rejects.toMatchObject({ statusCode: 401 });
});

it('Should not allow non storyteller users to get list of characters influences', async () => {
  const nonSTuser = await fakeUsersRepository.create({
    name: 'A non ST User',
    email: 'user@user.com',
    password: '123456',
    storyteller: false,
  });

  await expect(
    getCharacterInfluences.execute(nonSTuser.id),
  ).rejects.toMatchObject({ statusCode: 401 });
});
