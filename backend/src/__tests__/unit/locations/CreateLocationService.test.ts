import 'reflect-metadata';
import FakeLocationRepository from '@modules/locations/repositories/fakes/FakeLocationRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import CreateLocationService from '@modules/locations/services/CreateLocationService';

let fakeLocationRepository: FakeLocationRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeCharactersRepository: FakeCharactersRepository;
let createLocation: CreateLocationService;

describe('CreateLocationService', () => {
  beforeEach(() => {
    fakeLocationRepository = new FakeLocationRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeCharactersRepository = new FakeCharactersRepository();

    createLocation = new CreateLocationService(
      fakeLocationRepository,
      fakeUsersRepository,
      fakeCharactersRepository,
    );
  });

  it('Should be able to create a location', async () => {
    // Create a user
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const location = await createLocation.execute({
      user_id: user.id,
      name: 'Prefeitura de Curitiba',
      description: 'Prefeitura Municipal de Curitiba',
      latitude: -25.4166496,
      longitude: -49.2713069,
    });

    expect(location).toHaveProperty('id');
    expect(location).toMatchObject({
      name: 'Prefeitura de Curitiba',
      description: 'Prefeitura Municipal de Curitiba',
      address: '',
      latitude: -25.4166496,
      longitude: -49.2713069,
      elysium: false,
      type: 'other',
      level: 1,
      property: 'private',
    });
  });

  it('Should not allow not existant user to create location', async () => {
    await expect(
      createLocation.execute({
        user_id: 'I am invalid',
        name: 'Prefeitura de Curitiba',
        description: 'Prefeitura Municipal de Curitiba',
        latitude: -25.4166496,
        longitude: -49.2713069,
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow non storyteller user to create location', async () => {
    // Create a user
    const noStUser = await fakeUsersRepository.create({
      name: 'Not a ST User',
      email: 'user@user.com',
      password: '123456',
    });

    await expect(
      createLocation.execute({
        user_id: noStUser.id,
        name: 'Prefeitura de Curitiba',
        description: 'Prefeitura Municipal de Curitiba',
        latitude: -25.4166496,
        longitude: -49.2713069,
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should be able to create a location with a responsible character', async () => {
    // Create a user
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const char = await fakeCharactersRepository.create({
      user_id: user.id,
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
    });

    const location = await createLocation.execute({
      user_id: user.id,
      name: 'Prefeitura de Curitiba',
      description: 'Prefeitura Municipal de Curitiba',
      address: 'Av. Cândido de Abreu, 817',
      latitude: -25.4166496,
      longitude: -49.2713069,
      elysium: true,
      type: 'haven',
      level: 5,
      property: 'clan',
      clan: 'Ventrue',
      char_id: char.id,
    });

    expect(location).toHaveProperty('id');
    expect(location).toMatchObject({
      name: 'Prefeitura de Curitiba',
      description: 'Prefeitura Municipal de Curitiba',
      address: 'Av. Cândido de Abreu, 817',
      latitude: -25.4166496,
      longitude: -49.2713069,
      elysium: true,
      type: 'haven',
      level: 5,
      property: 'clan',
      clan: 'Ventrue',
      responsible: char.id,
    });
  });

  it('Should not allow to create a location with a non existant character as responsible', async () => {
    // Create a user
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      createLocation.execute({
        user_id: user.id,
        name: 'Prefeitura de Curitiba',
        description: 'Prefeitura Municipal de Curitiba',
        latitude: -25.4166496,
        longitude: -49.2713069,
        char_id: 'I do not exist',
      }),
    ).rejects.toMatchObject({ statusCode: 400 });
  });
});
