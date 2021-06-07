import 'reflect-metadata';
import FakeLocationsCharactersRepository from '@modules/locations/repositories/fakes/FakeLocationsCharactersRepository';
import FakeLocationsRepository from '@modules/locations/repositories/fakes/FakeLocationsRepository';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeSaveRouteResultProvider from '@shared/container/providers/SaveRouteResultProvider/fakes/FakeSaveRouteResultProvider';
import RemoveCharacterFromLocationService from '@modules/locations/services/RemoveCharacterFromLocationService';
import AppError from '@shared/errors/AppError';

let fakeLocationsCharactersRepository: FakeLocationsCharactersRepository;
let fakeLocationsRepository: FakeLocationsRepository;
let fakeCharactersRepository: FakeCharactersRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeSaveRouteResultProvider: FakeSaveRouteResultProvider;
let removeCharacterFromLocation: RemoveCharacterFromLocationService;

describe('RemoveCharacterFromLocation', () => {
  beforeEach(() => {
    fakeLocationsCharactersRepository = new FakeLocationsCharactersRepository();
    fakeLocationsRepository = new FakeLocationsRepository();
    fakeCharactersRepository = new FakeCharactersRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeSaveRouteResultProvider = new FakeSaveRouteResultProvider();

    removeCharacterFromLocation = new RemoveCharacterFromLocationService(
      fakeLocationsCharactersRepository,
      fakeUsersRepository,
      fakeSaveRouteResultProvider,
    );
  });

  it('Should be able to remove a character from a location', async () => {
    const removeResult = jest.spyOn(fakeSaveRouteResultProvider, 'remove');

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
      npc: false,
    });

    const location = await fakeLocationsRepository.create({
      name: 'Prefeitura de Curitiba',
      description: 'Prefeitura Municipal de Curitiba',
      latitude: -25.4166496,
      longitude: -49.2713069,
    });

    await fakeLocationsCharactersRepository.addCharToLocation(
      char.id,
      location.id,
    );

    const initialListSize = await fakeLocationsCharactersRepository.listCharactersByLocation(
      location.id,
    );

    await removeCharacterFromLocation.execute({
      user_id: user.id,
      char_id: char.id,
      location_id: location.id,
    });

    const finalListSize = await fakeLocationsCharactersRepository.listCharactersByLocation(
      location.id,
    );
    const findLocChar = await fakeLocationsCharactersRepository.find(
      char.id,
      location.id,
    );

    expect(finalListSize.length).toEqual(initialListSize.length - 1);
    expect(findLocChar).toBeUndefined();
    expect(removeResult).toHaveBeenCalledWith('LocationList:*');
  });

  it('Should not allow invalid user to remove character from a location', async () => {
    await expect(
      removeCharacterFromLocation.execute({
        user_id: 'I am invalid',
        char_id: 'Does not matter',
        location_id: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow non storyteller user to remove character from a location', async () => {
    const noStUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
    });

    await expect(
      removeCharacterFromLocation.execute({
        user_id: noStUser.id,
        char_id: 'Does not matter',
        location_id: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow to remove a character from a location that is not there', async () => {
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
      npc: false,
    });

    const location = await fakeLocationsRepository.create({
      name: 'Prefeitura de Curitiba',
      description: 'Prefeitura Municipal de Curitiba',
      latitude: -25.4166496,
      longitude: -49.2713069,
    });

    await expect(
      removeCharacterFromLocation.execute({
        user_id: user.id,
        char_id: char.id,
        location_id: location.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
