import 'reflect-metadata';
import FakeTerritoriesRepository from '@modules/locations/repositories/fakes/FakeTerritoriesRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import GetTerritoryService from '@modules/locations/services/GetTerritoryService';
import AppError from '@shared/errors/AppError';

let fakeTerritoriesRepository: FakeTerritoriesRepository;
let fakeUsersRepository: FakeUsersRepository;
let getTerritory: GetTerritoryService;

describe('GetTerritory', () => {
  beforeEach(() => {
    fakeTerritoriesRepository = new FakeTerritoriesRepository();
    fakeUsersRepository = new FakeUsersRepository();

    getTerritory = new GetTerritoryService(
      fakeTerritoriesRepository,
      fakeUsersRepository,
    );
  });

  it('Should be able to get a territory by id', async () => {
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

    const territoryLoaded = await getTerritory.execute({
      user_id: user.id,
      territory_id: territory.id,
    });

    expect(territoryLoaded).toMatchObject({
      id: territory.id,
      name: territory.name,
      population: territory.population,
      sect: territory.sect,
    });
  });

  it('Should be able to get a territory by name', async () => {
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

    const territoryLoaded = await getTerritory.execute({
      user_id: user.id,
      name: territory.name,
    });

    expect(territoryLoaded).toMatchObject({
      id: territory.id,
      name: territory.name,
      population: territory.population,
      sect: territory.sect,
    });
  });

  it('Should not allow invalid users to get a territory', async () => {
    await expect(
      getTerritory.execute({
        user_id: 'I do not exist',
        territory_id: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow non storyteller user to get a territory', async () => {
    const notStUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
    });

    await expect(
      getTerritory.execute({
        user_id: notStUser.id,
        territory_id: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow to get a non existant territory', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      getTerritory.execute({
        user_id: user.id,
        territory_id: 'I do not exist',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow to get a territory without provide its id or its name', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      getTerritory.execute({
        user_id: user.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
