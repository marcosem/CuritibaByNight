import 'reflect-metadata';
import FakeTerritoriesRepository from '@modules/locations/repositories/fakes/FakeTerritoriesRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AddTerritoryService from '@modules/locations/services/AddTerritoryService';

let fakeTerritoriesRepository: FakeTerritoriesRepository;
let fakeUsersRepository: FakeUsersRepository;
let addTerritory: AddTerritoryService;

describe('CreateLocation', () => {
  beforeEach(() => {
    fakeTerritoriesRepository = new FakeTerritoriesRepository();
    fakeUsersRepository = new FakeUsersRepository();

    addTerritory = new AddTerritoryService(
      fakeTerritoriesRepository,
      fakeUsersRepository,
    );
  });

  it('Should be able to add a territory', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const territory = await addTerritory.execute({
      user_id: user.id,
      name: 'Paranaguá',
      population: 154936,
      sect: 'Sabbat',
    });

    expect(territory).toHaveProperty('id');
    expect(territory).toMatchObject({
      name: 'Paranaguá',
      population: 154936,
      sect: 'Sabbat',
    });
  });

  it('Should not allow invalid user to create territory', async () => {
    await expect(
      addTerritory.execute({
        user_id: 'I am invalid',
        name: 'Paranaguá',
        population: 154936,
        sect: 'Sabbat',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow non storyteller user to create territory', async () => {
    const noStUser = await fakeUsersRepository.create({
      name: 'Not a ST User',
      email: 'user@user.com',
      password: '123456',
    });

    await expect(
      addTerritory.execute({
        user_id: noStUser.id,
        name: 'Paranaguá',
        population: 154936,
        sect: 'Sabbat',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});
