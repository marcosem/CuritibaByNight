import 'reflect-metadata';
import FakeTerritoriesRepository from '@modules/locations/repositories/fakes/FakeTerritoriesRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import UpdateTerritoryService from '@modules/locations/services/UpdateTerritoryService';
import AppError from '@shared/errors/AppError';

let fakeTerritoriesRepository: FakeTerritoriesRepository;
let fakeUsersRepository: FakeUsersRepository;
let updateTerritory: UpdateTerritoryService;

describe('UpdateTerritory', () => {
  beforeEach(() => {
    fakeTerritoriesRepository = new FakeTerritoriesRepository();
    fakeUsersRepository = new FakeUsersRepository();

    updateTerritory = new UpdateTerritoryService(
      fakeTerritoriesRepository,
      fakeUsersRepository,
    );
  });

  it('Should be able to update a territory', async () => {
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

    const newTerritory = {
      id: territory.id,
      name: 'Paranaguá do Sul',
      population: 154937,
      sect: 'Camarilla',
    };

    const updatedTerritory = await updateTerritory.execute({
      user_id: user.id,
      territory_id: newTerritory.id,
      name: newTerritory.name,
      population: newTerritory.population,
      sect: newTerritory.sect,
    });

    expect(updatedTerritory).toMatchObject(newTerritory);
  });

  it('Should be able to update a territory without change sect', async () => {
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

    const newTerritory = {
      id: territory.id,
      name: 'Paranaguá do Sul',
      population: 154937,
      sect: territory.sect,
    };

    const updatedTerritory = await updateTerritory.execute({
      user_id: user.id,
      territory_id: newTerritory.id,
      name: newTerritory.name,
      population: newTerritory.population,
    });

    expect(updatedTerritory).toMatchObject(newTerritory);
  });

  it('Should not allow invalid users to update territory', async () => {
    await expect(
      updateTerritory.execute({
        user_id: 'I am invalid',
        territory_id: 'Does not matter',
        name: 'Does not matter',
        population: 0,
        sect: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow non storyteller users to update territory', async () => {
    const noStUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
    });

    await expect(
      updateTerritory.execute({
        user_id: noStUser.id,
        territory_id: 'Does not matter',
        name: 'Does not matter',
        population: 0,
        sect: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow update a non existant territory', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      updateTerritory.execute({
        user_id: user.id,
        territory_id: 'Does not matter',
        name: 'Does not matter',
        population: 0,
        sect: 'Does not matter',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
