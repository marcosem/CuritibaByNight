import 'reflect-metadata';
import FakeTerritoriesRepository from '@modules/locations/repositories/fakes/FakeTerritoriesRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import GetTerritoriesListService from '@modules/locations/services/GetTerritoriesListService';
// import AppError from '@shared/errors/AppError';

let fakeTerritoriesRepository: FakeTerritoriesRepository;
let fakeUsersRepository: FakeUsersRepository;
let getTerritoriesList: GetTerritoriesListService;

describe('GetTerritoriesList', () => {
  beforeAll(async () => {
    fakeTerritoriesRepository = new FakeTerritoriesRepository();

    await fakeTerritoriesRepository.create({
      name: 'Paranaguá',
      population: 154936,
      sect: 'Sabbat',
    });

    await fakeTerritoriesRepository.create({
      name: 'Quatro Barras',
      population: 23465,
      sect: 'Followers of Set',
    });

    await fakeTerritoriesRepository.create({
      name: 'Rio Negro',
      population: 34170,
      sect: 'Anarch',
    });
  });

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    getTerritoriesList = new GetTerritoriesListService(
      fakeTerritoriesRepository,
      fakeUsersRepository,
    );
  });

  it('Should be able to get a list of all territories', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const territoriesList = await getTerritoriesList.execute({
      user_id: user.id,
    });

    expect(territoriesList).toHaveLength(3);
    expect(territoriesList[0]).toMatchObject({
      name: 'Paranaguá',
      population: 154936,
      sect: 'Sabbat',
    });

    expect(territoriesList[1]).toMatchObject({
      name: 'Quatro Barras',
      population: 23465,
      sect: 'Followers of Set',
    });

    expect(territoriesList[2]).toMatchObject({
      name: 'Rio Negro',
      population: 34170,
      sect: 'Anarch',
    });
  });

  it('Should not allow invalid users to get a list of territories', async () => {
    await expect(
      getTerritoriesList.execute({ user_id: 'I am invalid' }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow non storyteller user to get list of territories', async () => {
    const notStUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
    });

    await expect(
      getTerritoriesList.execute({ user_id: notStUser.id }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});
