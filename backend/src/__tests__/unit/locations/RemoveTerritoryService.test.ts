import 'reflect-metadata';
import FakeTerritoriesRepository from '@modules/locations/repositories/fakes/FakeTerritoriesRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import RemoveTerritoryService from '@modules/locations/services/RemoveTerritoryService';
import AppError from '@shared/errors/AppError';

let fakeTerritoriesRepository: FakeTerritoriesRepository;
let fakeUsersRepository: FakeUsersRepository;
let removeTerritory: RemoveTerritoryService;

describe('RemoveTerritory', () => {
  beforeEach(() => {
    fakeTerritoriesRepository = new FakeTerritoriesRepository();
    fakeUsersRepository = new FakeUsersRepository();

    removeTerritory = new RemoveTerritoryService(
      fakeTerritoriesRepository,
      fakeUsersRepository,
    );
  });

  it('Should be able to remove a territory', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const territory = await fakeTerritoriesRepository.create({
      name: 'Paranaguá',
      population: 154936,
      sect: 'Sabbat',
    });

    const initialListSize = await fakeTerritoriesRepository.listAll();

    await removeTerritory.execute({
      user_id: user.id,
      territory_id: territory.id,
    });

    const finalListSize = await fakeTerritoriesRepository.listAll();
    const findTerritory = await fakeTerritoriesRepository.findById(
      territory.id,
    );

    expect(finalListSize).toHaveLength(initialListSize.length - 1);
    expect(findTerritory).toBeUndefined();
  });

  it('Should not allow invalid users to remove a territory', async () => {
    await expect(
      removeTerritory.execute({
        user_id: 'I do not exist',
        territory_id: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow non storyteller users remove a territory', async () => {
    const noSTUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
    });

    await expect(
      removeTerritory.execute({
        user_id: noSTUser.id,
        territory_id: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow remove a non existant territory', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      removeTerritory.execute({
        user_id: user.id,
        territory_id: 'I do not exist',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
