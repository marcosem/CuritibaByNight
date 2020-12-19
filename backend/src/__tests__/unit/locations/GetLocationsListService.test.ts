import 'reflect-metadata';
import FakeLocationRepository from '@modules/locations/repositories/fakes/FakeLocationRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import GetLocationsListService from '@modules/locations/services/GetLocationsListService';

let fakeLocationRepository: FakeLocationRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeCharactersRepository: FakeCharactersRepository;
let getLocationsList: GetLocationsListService;

describe('GetLocationsListService', () => {
  beforeAll(async () => {
    fakeLocationRepository = new FakeLocationRepository();

    await fakeLocationRepository.create({
      name: 'Prefeitura de Curitiba',
      description: 'Prefeitura Municipal de Curitiba',
      latitude: -25.4166496,
      longitude: -49.2713069,
      property: 'public',
      clan: 'Ventrue',
    });

    await fakeLocationRepository.create({
      name: 'Paço da Liberdade',
      description: 'Elysium Tremere',
      latitude: -25.4166496,
      longitude: -49.2713069,
      elysium: true,
      clan: 'Tremere',
    });

    await fakeLocationRepository.create({
      name: 'Ateliê Victor Gentil',
      description: 'Refúgio Toreador',
      latitude: -25.4166496,
      longitude: -49.2713069,
      clan: 'Toreador',
    });
  });

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCharactersRepository = new FakeCharactersRepository();

    getLocationsList = new GetLocationsListService(
      fakeLocationRepository,
      fakeUsersRepository,
      fakeCharactersRepository,
    );
  });

  it('Should be able to get a list of all locations', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const locationsList = await getLocationsList.execute({ user_id: user.id });

    expect(locationsList).toHaveLength(3);
    expect(locationsList[0]).toMatchObject({
      name: 'Prefeitura de Curitiba',
      description: 'Prefeitura Municipal de Curitiba',
      latitude: -25.4166496,
      longitude: -49.2713069,
      property: 'public',
      clan: 'Ventrue',
    });

    expect(locationsList[1]).toMatchObject({
      name: 'Paço da Liberdade',
      description: 'Elysium Tremere',
      latitude: -25.4166496,
      longitude: -49.2713069,
      elysium: true,
      clan: 'Tremere',
    });

    expect(locationsList[2]).toMatchObject({
      name: 'Ateliê Victor Gentil',
      description: 'Refúgio Toreador',
      latitude: -25.4166496,
      longitude: -49.2713069,
      clan: 'Toreador',
    });
  });

  it('Should not allow invalid users to geta list of locations', async () => {
    await expect(
      getLocationsList.execute({ user_id: 'I am invalid' }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow non storyteller user to load a locations with character not defined', async () => {
    const notStUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
    });

    await expect(
      getLocationsList.execute({ user_id: notStUser.id }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should allow get public and elysiums locations', async () => {
    const noStUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
    });

    const char = await fakeCharactersRepository.create({
      user_id: noStUser.id,
      name: 'Dracula',
      experience: 666,
      clan: 'Tzimisce',
      file: 'dracula.pdf',
    });

    const locationsList = await getLocationsList.execute({
      user_id: noStUser.id,
      char_id: char.id,
    });

    expect(locationsList).toHaveLength(2);
    expect(locationsList[0]).toMatchObject({
      name: 'Prefeitura de Curitiba',
      description: 'Prefeitura Municipal de Curitiba',
      latitude: -25.4166496,
      longitude: -49.2713069,
      property: 'public',
      clan: 'Ventrue',
    });

    expect(locationsList[1]).toMatchObject({
      name: 'Paço da Liberdade',
      description: 'Elysium Tremere',
      latitude: -25.4166496,
      longitude: -49.2713069,
      elysium: true,
      clan: 'Tremere',
    });
  });

  it('Should not allow invalid characters to get locations list', async () => {
    const noStUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
    });

    await expect(
      getLocationsList.execute({
        user_id: noStUser.id,
        char_id: 'I am invalid',
      }),
    ).rejects.toMatchObject({ statusCode: 400 });
  });
});
