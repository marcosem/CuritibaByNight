import 'reflect-metadata';
import FakeLocationsRepository from '@modules/locations/repositories/fakes/FakeLocationsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import UpdateLocationService from '@modules/locations/services/UpdateLocationService';
import AppError from '@shared/errors/AppError';

let fakeLocationsRepository: FakeLocationsRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeCharactersRepository: FakeCharactersRepository;
let updateLocation: UpdateLocationService;

describe('UpdateLocation', () => {
  beforeEach(() => {
    fakeLocationsRepository = new FakeLocationsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeCharactersRepository = new FakeCharactersRepository();

    updateLocation = new UpdateLocationService(
      fakeLocationsRepository,
      fakeCharactersRepository,
      fakeUsersRepository,
    );
  });

  it('Should be able to update a location', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const location = await fakeLocationsRepository.create({
      name: 'Prefeitura de Curitiba',
      description: 'Prefeitura Municipal de Curitiba',
      latitude: -25.4166496,
      longitude: -49.2713069,
    });

    const newLocation = {
      id: location.id,
      name: 'Prefeitura Municipal de Curitiba',
      description: 'Prefeitura de Curitiba',
      address: 'Rua da Prefeitura, 2000',
      latitude: -25.4166497,
      longitude: -49.271307,
      elysium: true,
      type: 'haven',
      level: 5,
      mystical_level: 2,
      property: 'clan',
      creature_type: 'Vampire',
      sect: 'Camarilla',
      clan: 'Ventrue',
    };

    const updatedLocation = await updateLocation.execute({
      user_id: user.id,
      location_id: newLocation.id,
      name: newLocation.name,
      description: newLocation.description,
      address: newLocation.address,
      latitude: newLocation.latitude,
      longitude: newLocation.longitude,
      elysium: newLocation.elysium,
      type: newLocation.type,
      level: newLocation.level,
      mystical_level: newLocation.mystical_level,
      property: newLocation.property,
      clan: newLocation.clan,
      creature_type: newLocation.creature_type,
      sect: newLocation.sect,
    });

    expect(updatedLocation).toMatchObject(newLocation);
  });

  it('Should be able to update the location responsible character only', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const location = await fakeLocationsRepository.create({
      name: 'Prefeitura de Curitiba',
      description: 'Prefeitura Municipal de Curitiba',
      latitude: -25.4166496,
      longitude: -49.2713069,
    });

    const char = await fakeCharactersRepository.create({
      user_id: user.id,
      name: 'Dracula',
      experience: 666,
      clan: 'Tzimisce',
      file: 'dracula.pdf',
      npc: false,
    });

    const newLocation = {
      id: location.id,
      responsible: char.id,
    };

    const updatedLocation = await updateLocation.execute({
      user_id: user.id,
      location_id: newLocation.id,
      char_id: newLocation.responsible,
    });

    expect(updatedLocation).toMatchObject(newLocation);
  });

  it('Should not allow invalid users to update location', async () => {
    await expect(
      updateLocation.execute({
        user_id: 'I am invalid',
        location_id: 'Does not matter',
        char_id: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow non storyteller users to update location', async () => {
    const noStUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
    });

    await expect(
      updateLocation.execute({
        user_id: noStUser.id,
        location_id: 'Does not matter',
        char_id: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow update a non existant location', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      updateLocation.execute({
        user_id: user.id,
        location_id: 'I do not exist',
        char_id: 'Does not matter',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow update a location with a non existant responsible', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const location = await fakeLocationsRepository.create({
      name: 'Prefeitura de Curitiba',
      description: 'Prefeitura Municipal de Curitiba',
      latitude: -25.4166496,
      longitude: -49.2713069,
    });

    await expect(
      updateLocation.execute({
        user_id: user.id,
        location_id: location.id,
        char_id: 'I do not exist',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
