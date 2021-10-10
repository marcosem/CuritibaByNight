import 'reflect-metadata';
import FakeLocationsCharactersRepository from '@modules/locations/repositories/fakes/FakeLocationsCharactersRepository';
import FakeLocationsRepository from '@modules/locations/repositories/fakes/FakeLocationsRepository';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import GetLocationCharactersListService from '@modules/locations/services/GetLocationCharactersListService';

import AppError from '@shared/errors/AppError';

let fakeLocationsCharactersRepository: FakeLocationsCharactersRepository;
let fakeLocationsRepository: FakeLocationsRepository;
let fakeCharactersRepository: FakeCharactersRepository;
let fakeUsersRepository: FakeUsersRepository;
let getLocationCharactersList: GetLocationCharactersListService;

describe('GetLocationCharactersList', () => {
  beforeEach(() => {
    fakeLocationsCharactersRepository = new FakeLocationsCharactersRepository();
    fakeLocationsRepository = new FakeLocationsRepository();
    fakeCharactersRepository = new FakeCharactersRepository();
    fakeUsersRepository = new FakeUsersRepository();

    getLocationCharactersList = new GetLocationCharactersListService(
      fakeLocationsCharactersRepository,
      fakeUsersRepository,
      fakeLocationsRepository,
    );
  });

  it('Should be able to list all characters aware of a location', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const char1 = await fakeCharactersRepository.create({
      user_id: user.id,
      name: 'Dracula',
      clan: 'Tzimisce',
      experience: 666,
      file: 'dracula.pdf',
      npc: false,
    });

    const char2 = await fakeCharactersRepository.create({
      user_id: user.id,
      name: 'Zizar',
      clan: 'Nosferatu',
      experience: 123,
      file: 'zizar.pdf',
      npc: false,
    });

    const location = await fakeLocationsRepository.create({
      name: 'Prefeitura de Curitiba',
      description: 'Prefeitura Municipal de Curitiba',
      latitude: -25.4166496,
      longitude: -49.2713069,
    });

    await fakeLocationsCharactersRepository.addCharToLocation(
      char1.id,
      location.id,
      false,
    );

    await fakeLocationsCharactersRepository.addCharToLocation(
      char2.id,
      location.id,
      false,
    );

    const locationCharsList = await getLocationCharactersList.execute({
      user_id: user.id,
      location_id: location.id,
    });

    expect(locationCharsList).toHaveLength(2);
    expect(locationCharsList[0].character_id).toBe(char1.id);
    expect(locationCharsList[1].character_id).toBe(char2.id);
  });

  it('Should not allow invalid user to list characters of a location', async () => {
    await expect(
      getLocationCharactersList.execute({
        user_id: 'I am invalid',
        location_id: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow non storyteller user to list characters of a location', async () => {
    const noStUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
    });

    await expect(
      getLocationCharactersList.execute({
        user_id: noStUser.id,
        location_id: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow to list characters of a non existant location', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      getLocationCharactersList.execute({
        user_id: user.id,
        location_id: 'I do not exist',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
