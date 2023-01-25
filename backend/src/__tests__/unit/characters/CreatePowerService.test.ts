import 'reflect-metadata';
import FakePowersRepository from '@modules/characters/repositories/fakes/FakePowersRepository';
import FakeCharactersTraitsRepository from '@modules/characters/repositories/fakes/FakeCharactersTraitsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreatePowerService from '@modules/characters/services/CreatePowerService';
import Power from '@modules/characters/infra/typeorm/entities/Power';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeCharactersTraitsRepository: FakeCharactersTraitsRepository;
let fakePowersRepository: FakePowersRepository;
let createPower: CreatePowerService;

describe('CreatePower', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCharactersTraitsRepository = new FakeCharactersTraitsRepository();
    fakePowersRepository = new FakePowersRepository();

    createPower = new CreatePowerService(
      fakePowersRepository,
      fakeCharactersTraitsRepository,
      fakeUsersRepository,
    );
  });

  it('Should be able to create a power', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await fakeCharactersTraitsRepository.createList([
      {
        trait: 'Animalism',
        character_id: 'Does not matter',
        level: 3,
        type: 'powers',
      },
      {
        trait: 'Akhu: Brand of the Paramour',
        character_id: 'Does not matter',
        level: 1,
        type: 'rituals',
      },
      {
        trait: 'Toreador: Soul Painting',
        character_id: 'Does not matter',
        level: 0,
        type: 'powers',
      },
    ]);

    const power = await createPower.execute({
      user_id: user.id,
      long_name: 'Animalism',
      short_name: 'Feral Whispers',
      level: 1,
      type: 'discipline',
      origin: '',
      requirements: '',
      description: 'My description',
      system: 'My system',
      cost: 0,
      source: 'LotN pg134',
    });

    const powerTemplate: Power = {
      id: expect.any(String),
      long_name: 'Animalism',
      short_name: 'Feral Whispers',
      level: 1,
      type: 'discipline',
      origin: '',
      requirements: '',
      description: 'My description',
      system: 'My system',
      cost: 0,
      source: 'LotN pg134',
    } as Power;

    expect(power).toMatchObject(powerTemplate);
  });

  it('Should not allow invalid users to create powers', async () => {
    await expect(
      createPower.execute({
        user_id: 'Invalid User',
        long_name: 'Animalism',
        short_name: 'Feral Whispers',
        description: 'My description',
        system: 'My system',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow non storyteller user to create powers', async () => {
    const nonSTUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'notSTuser@user.com',
      password: '123456',
    });

    await expect(
      createPower.execute({
        user_id: nonSTUser.id,
        long_name: 'Animalism',
        short_name: 'Feral Whispers',
        description: 'My description',
        system: 'My system',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow to add a power that does not exist in Traits List', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await fakeCharactersTraitsRepository.createList([
      {
        trait: 'Animalism',
        character_id: 'Does not matter',
        level: 3,
        type: 'powers',
      },
      {
        trait: 'Akhu: Brand of the Paramour',
        character_id: 'Does not matter',
        level: 1,
        type: 'rituals',
      },
      {
        trait: 'Toreador: Soul Painting',
        character_id: 'Does not matter',
        level: 0,
        type: 'powers',
      },
    ]);

    await expect(
      createPower.execute({
        user_id: user.id,
        long_name: 'Presence',
        short_name: 'Majesty',
        description: 'My description',
        system: 'My system',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow to add a duplicated power', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await fakeCharactersTraitsRepository.createList([
      {
        trait: 'Animalism',
        character_id: 'Does not matter',
        level: 3,
        type: 'powers',
      },
      {
        trait: 'Akhu: Brand of the Paramour',
        character_id: 'Does not matter',
        level: 1,
        type: 'rituals',
      },
      {
        trait: 'Toreador: Soul Painting',
        character_id: 'Does not matter',
        level: 0,
        type: 'powers',
      },
    ]);

    await fakePowersRepository.create({
      long_name: 'Animalism',
      short_name: 'Feral Whispers',
      level: 1,
      type: 'discipline',
      description: 'My description',
      system: 'My system',
    });

    await expect(
      createPower.execute({
        user_id: user.id,
        long_name: 'Animalism',
        short_name: 'Feral Whispers',
        level: 1,
        type: 'discipline',
        description: 'My description',
        system: 'My system',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
