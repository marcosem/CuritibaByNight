import 'reflect-metadata';
import FakeLocationsRepository from '@modules/locations/repositories/fakes/FakeLocationsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import GetLocationsListService from '@modules/locations/services/GetLocationsListService';
import FakeLocationsCharactersRepository from '@modules/locations/repositories/fakes/FakeLocationsCharactersRepository';
import AppError from '@shared/errors/AppError';

let fakeLocationsRepository: FakeLocationsRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeCharactersRepository: FakeCharactersRepository;
let fakeLocationsCharactersRepository: FakeLocationsCharactersRepository;
let getLocationsList: GetLocationsListService;

describe('GetLocationsList', () => {
  beforeAll(async () => {
    fakeLocationsRepository = new FakeLocationsRepository();

    await fakeLocationsRepository.create({
      name: 'Prefeitura de Curitiba',
      description: 'Prefeitura Municipal de Curitiba',
      latitude: -25.4166496,
      longitude: -49.2713069,
      property: 'public',
      clan: 'Ventrue',
    });

    await fakeLocationsRepository.create({
      name: 'Paço da Liberdade',
      description: 'Elysium Tremere',
      latitude: -25.4166496,
      longitude: -49.2713069,
      elysium: true,
      clan: 'Tremere',
    });

    await fakeLocationsRepository.create({
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
    fakeLocationsCharactersRepository = new FakeLocationsCharactersRepository();

    getLocationsList = new GetLocationsListService(
      fakeLocationsRepository,
      fakeUsersRepository,
      fakeCharactersRepository,
      fakeLocationsCharactersRepository,
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

  it('Should not allow invalid users to get a list of locations', async () => {
    await expect(
      getLocationsList.execute({ user_id: 'I am invalid' }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow non storyteller user to load locations with character not defined', async () => {
    const notStUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
    });

    await expect(
      getLocationsList.execute({ user_id: notStUser.id }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should allow get public locations', async () => {
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
      npc: false,
    });

    const locationsList = await getLocationsList.execute({
      user_id: noStUser.id,
      char_id: char.id,
    });

    expect(locationsList).toHaveLength(1);
    expect(locationsList[0]).toMatchObject({
      name: 'Prefeitura de Curitiba',
      description: 'Prefeitura Municipal de Curitiba',
      latitude: -25.4166496,
      longitude: -49.2713069,
      property: 'public',
      clan: 'Ventrue',
    });
  });

  it('Should allow get locations the character is aware of', async () => {
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
      npc: false,
    });

    const secretLocation = await fakeLocationsRepository.create({
      name: 'Secret Chamber',
      description: 'Hidden',
      latitude: -25.4166496,
      longitude: -49.2713069,
      property: 'private',
    });

    await fakeLocationsCharactersRepository.addCharToLocation(
      char.id,
      secretLocation.id,
      true,
    );

    const locationsList = await getLocationsList.execute({
      user_id: noStUser.id,
      char_id: char.id,
    });

    expect(locationsList[1]).toMatchObject({
      name: 'Secret Chamber',
      description: 'Hidden',
      latitude: -25.4166496,
      longitude: -49.2713069,
      property: 'private',
    });
  });

  it('Should allow add invalid character-locations to the list', async () => {
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
      npc: false,
    });

    const secretLocation = await fakeLocationsRepository.create({
      name: 'Secret Chamber',
      description: 'Hidden',
      latitude: -25.4166496,
      longitude: -49.2713069,
      property: 'private',
    });

    await fakeLocationsCharactersRepository.addCharToLocation(
      char.id,
      secretLocation.id,
      false,
    );

    jest
      .spyOn(fakeLocationsRepository, 'findById')
      .mockReturnValue(Promise.resolve(undefined));

    const locationsList = await getLocationsList.execute({
      user_id: noStUser.id,
      char_id: char.id,
    });

    expect(locationsList[2]).toBeUndefined();
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
    ).rejects.toBeInstanceOf(AppError);
  });
});
