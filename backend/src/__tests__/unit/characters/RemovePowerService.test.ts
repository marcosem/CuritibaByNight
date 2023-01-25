import 'reflect-metadata';
import FakePowersRepository from '@modules/characters/repositories/fakes/FakePowersRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import RemovePowerService from '@modules/characters/services/RemovePowerService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakePowersRepository: FakePowersRepository;
let removePower: RemovePowerService;

describe('RemovePower', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakePowersRepository = new FakePowersRepository();

    removePower = new RemovePowerService(
      fakePowersRepository,
      fakeUsersRepository,
    );
  });

  it('Should be able to remove a power', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const power = await fakePowersRepository.create({
      long_name: 'Animalism',
      short_name: 'Feral Whispers',
      level: 1,
      type: 'discipline',
      description: 'My description',
      system: 'My system',
    });

    const initialListSize = await fakePowersRepository.listAll();

    await removePower.execute({
      user_id: user.id,
      power_id: power.id,
    });

    const finalListSize = await fakePowersRepository.listAll();
    const findPower = await fakePowersRepository.findById(power.id);
    expect(finalListSize).toHaveLength(initialListSize.length - 1);
    expect(findPower).toBeUndefined();
  });

  it('Should not allow invalid users to remove powers', async () => {
    await expect(
      removePower.execute({
        user_id: 'Invalid User',
        power_id: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow non storyteller user to remove powers', async () => {
    const nonSTUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'notSTuser@user.com',
      password: '123456',
    });

    await expect(
      removePower.execute({
        user_id: nonSTUser.id,
        power_id: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow to remove a power that does not exists', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      removePower.execute({
        user_id: user.id,
        power_id: 'Invalid power',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
