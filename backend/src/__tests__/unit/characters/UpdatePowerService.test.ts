import 'reflect-metadata';
import FakePowersRepository from '@modules/characters/repositories/fakes/FakePowersRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import UpdatePowerService from '@modules/characters/services/UpdatePowerService';
import Power from '@modules/characters/infra/typeorm/entities/Power';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakePowersRepository: FakePowersRepository;
let updatePower: UpdatePowerService;

describe('UpdatePower', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakePowersRepository = new FakePowersRepository();

    updatePower = new UpdatePowerService(
      fakePowersRepository,
      fakeUsersRepository,
    );
  });

  it('Should be able to update a power', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const power = await fakePowersRepository.create({
      long_name: 'Animalism',
      short_name: 'Feral Whisper',
      level: 1,
      description: 'My description',
      system: 'My system',
      cost: 5,
    });

    const powerUpdated = await updatePower.execute({
      user_id: user.id,
      power_id: power.id,
      long_name: 'Animalism',
      short_name: 'Feral Whispers',
      level: 1,
      type: 'discipline',
      origin: 'Gangrel',
      requirements: 'Animalism 0',
      description: 'New description',
      system: 'New system',
      cost: 0,
      source: 'LotN pg134',
    });

    const powerTemplate: Power = {
      id: power.id,
      long_name: power.long_name,
      short_name: 'Feral Whispers',
      level: power.level,
      type: 'discipline',
      origin: 'Gangrel',
      requirements: 'Animalism 0',
      description: 'New description',
      system: 'New system',
      cost: 0,
      source: 'LotN pg134',
    } as Power;

    expect(powerUpdated).toMatchObject(powerTemplate);
  });

  it('Should not allow invalid users to update powers', async () => {
    await expect(
      updatePower.execute({
        user_id: 'Invalid User',
        power_id: 'Does not matter',
        long_name: 'Animalism',
        short_name: 'Feral Whispers',
        description: 'New description',
        system: 'New system',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow non storyteller user to update powers', async () => {
    const nonSTUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'notSTuser@user.com',
      password: '123456',
    });

    await expect(
      updatePower.execute({
        user_id: nonSTUser.id,
        power_id: 'Does not matter',
        long_name: 'Animalism',
        short_name: 'Feral Whispers',
        description: 'New description',
        system: 'New system',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow to update a power that does not exists', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      updatePower.execute({
        user_id: user.id,
        power_id: 'Invalid power',
        long_name: 'Animalism',
        short_name: 'Feral Whispers',
        description: 'New description',
        system: 'New system',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow to update long name of the power', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const power = await fakePowersRepository.create({
      long_name: 'Animalism',
      short_name: 'Feral Whisper',
      level: 1,
      description: 'My description',
      system: 'My system',
    });

    await expect(
      updatePower.execute({
        user_id: user.id,
        power_id: power.id,
        long_name: 'Presence',
        short_name: 'Feral Whispers',
        description: 'New description',
        system: 'New system',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow to update the level of the power', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const power = await fakePowersRepository.create({
      long_name: 'Animalism',
      short_name: 'Feral Whisper',
      level: 1,
      description: 'My description',
      system: 'My system',
    });

    await expect(
      updatePower.execute({
        user_id: user.id,
        power_id: power.id,
        long_name: 'Animalism',
        short_name: 'Feral Whispers',
        level: 2,
        description: 'New description',
        system: 'New system',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
