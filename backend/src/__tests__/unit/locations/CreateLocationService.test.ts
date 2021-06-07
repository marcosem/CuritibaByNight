import 'reflect-metadata';
import FakeLocationsRepository from '@modules/locations/repositories/fakes/FakeLocationsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeSaveRouteResultProvider from '@shared/container/providers/SaveRouteResultProvider/fakes/FakeSaveRouteResultProvider';
import CreateLocationService from '@modules/locations/services/CreateLocationService';
import AppError from '@shared/errors/AppError';

let fakeLocationsRepository: FakeLocationsRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeCharactersRepository: FakeCharactersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeSaveRouteResultProvider: FakeSaveRouteResultProvider;
let createLocation: CreateLocationService;

describe('CreateLocation', () => {
  beforeEach(() => {
    fakeLocationsRepository = new FakeLocationsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeCharactersRepository = new FakeCharactersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeSaveRouteResultProvider = new FakeSaveRouteResultProvider();

    createLocation = new CreateLocationService(
      fakeLocationsRepository,
      fakeUsersRepository,
      fakeCharactersRepository,
      fakeMailProvider,
      fakeSaveRouteResultProvider,
    );
  });

  it('Should be able to create a location', async () => {
    const removeResult = jest.spyOn(fakeSaveRouteResultProvider, 'remove');

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
      mystical_level: 0,
      property: 'private',
    });
    expect(removeResult).toHaveBeenCalledWith('LocationList:*');
  });

  it('Should not allow invalid user to create location', async () => {
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
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

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
    expect(sendMail).toHaveBeenCalled();
  });

  it('Should be able to create a location with a responsible NPC character', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const char = await fakeCharactersRepository.create({
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
      npc: true,
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
      mystical_level: 0,
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
      mystical_level: 0,
      property: 'clan',
      clan: 'Ventrue',
      responsible: char.id,
    });
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('Should not allow to create a location with a non existant character as responsible', async () => {
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
    ).rejects.toBeInstanceOf(AppError);
  });
});
