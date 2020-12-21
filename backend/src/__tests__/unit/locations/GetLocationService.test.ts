import 'reflect-metadata';
import FakeLocationRepository from '@modules/locations/repositories/fakes/FakeLocationRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import GetLocationService from '@modules/locations/services/GetLocationService';
import AppError from '@shared/errors/AppError';

let fakeLocationRepository: FakeLocationRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeCharactersRepository: FakeCharactersRepository;
let getLocation: GetLocationService;

describe('GetLocation', () => {
  beforeEach(() => {
    fakeLocationRepository = new FakeLocationRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeCharactersRepository = new FakeCharactersRepository();

    getLocation = new GetLocationService(
      fakeLocationRepository,
      fakeUsersRepository,
      fakeCharactersRepository,
    );
  });

  it('Should be able to get a location', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const location = await fakeLocationRepository.create({
      name: 'Prefeitura de Curitiba',
      description: 'Prefeitura Municipal de Curitiba',
      latitude: -25.4166496,
      longitude: -49.2713069,
    });

    const locationLoaded = await getLocation.execute({
      user_id: user.id,
      location_id: location.id,
    });

    expect(locationLoaded).toMatchObject({
      id: location.id,
      name: location.name,
      description: location.description,
      latitude: location.latitude,
      longitude: location.longitude,
    });
  });

  it('Should be able to get a public location', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const location = await fakeLocationRepository.create({
      name: 'Prefeitura de Curitiba',
      description: 'Prefeitura Municipal de Curitiba',
      latitude: -25.4166496,
      longitude: -49.2713069,
      property: 'public',
    });

    const locationLoaded = await getLocation.execute({
      user_id: user.id,
      location_id: location.id,
    });

    expect(locationLoaded).toMatchObject({
      id: location.id,
      name: location.name,
      description: location.description,
      latitude: location.latitude,
      longitude: location.longitude,
      property: 'public',
    });
  });

  it('Should be able to get an elysium location', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const location = await fakeLocationRepository.create({
      name: 'Prefeitura de Curitiba',
      description: 'Prefeitura Municipal de Curitiba',
      latitude: -25.4166496,
      longitude: -49.2713069,
      elysium: true,
    });

    const locationLoaded = await getLocation.execute({
      user_id: user.id,
      location_id: location.id,
    });

    expect(locationLoaded).toMatchObject({
      id: location.id,
      name: location.name,
      description: location.description,
      latitude: location.latitude,
      longitude: location.longitude,
      elysium: true,
    });
  });

  it('Should be able to get the character location', async () => {
    const noStUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
    });

    const char = await fakeCharactersRepository.create({
      user_id: noStUser.id,
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
    });

    const location = await fakeLocationRepository.create({
      name: 'Prefeitura de Curitiba',
      description: 'Prefeitura Municipal de Curitiba',
      latitude: -25.4166496,
      longitude: -49.2713069,
      responsible: char.id,
    });

    const locationLoaded = await getLocation.execute({
      user_id: noStUser.id,
      char_id: char.id,
      location_id: location.id,
    });

    expect(locationLoaded).toMatchObject({
      id: location.id,
      name: location.name,
      description: location.description,
      latitude: location.latitude,
      longitude: location.longitude,
      responsible: char.id,
    });
  });

  it('Should be able to get the character clan location', async () => {
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

    const location = await fakeLocationRepository.create({
      name: 'Prefeitura de Curitiba',
      description: 'Prefeitura Municipal de Curitiba',
      latitude: -25.4166496,
      longitude: -49.2713069,
      clan: 'Tzimisce',
    });

    const locationLoaded = await getLocation.execute({
      user_id: noStUser.id,
      char_id: char.id,
      location_id: location.id,
    });

    expect(locationLoaded).toMatchObject({
      id: location.id,
      name: location.name,
      description: location.description,
      latitude: location.latitude,
      longitude: location.longitude,
      clan: 'Tzimisce',
    });
  });

  it('Should not allow invalid users to get a location', async () => {
    await expect(
      getLocation.execute({
        user_id: 'I do not exist',
        location_id: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow non storyteller user to load a location with character not defined', async () => {
    const notStUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
    });

    await expect(
      getLocation.execute({
        user_id: notStUser.id,
        location_id: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow to get a non existant location', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      getLocation.execute({
        user_id: user.id,
        location_id: 'I do not exist',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow get clan location other than the character one', async () => {
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

    const location = await fakeLocationRepository.create({
      name: 'Prefeitura de Curitiba',
      description: 'Prefeitura Municipal de Curitiba',
      latitude: -25.4166496,
      longitude: -49.2713069,
      clan: 'Ventrue',
    });

    await expect(
      getLocation.execute({
        user_id: noStUser.id,
        char_id: char.id,
        location_id: location.id,
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow not existant character to get a location', async () => {
    const noStUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
    });

    const location = await fakeLocationRepository.create({
      name: 'Prefeitura de Curitiba',
      description: 'Prefeitura Municipal de Curitiba',
      latitude: -25.4166496,
      longitude: -49.2713069,
    });

    await expect(
      getLocation.execute({
        user_id: noStUser.id,
        char_id: 'I do not exist',
        location_id: location.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
