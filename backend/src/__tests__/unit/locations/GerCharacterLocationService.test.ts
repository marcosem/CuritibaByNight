import 'reflect-metadata';
import FakeLocationsCharactersRepository from '@modules/locations/repositories/fakes/FakeLocationsCharactersRepository';
import FakeLocationsRepository from '@modules/locations/repositories/fakes/FakeLocationsRepository';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import GetCharacterLocationService from '@modules/locations/services/GetCharacterLocationService';
import AppError from '@shared/errors/AppError';

let fakeLocationsCharactersRepository: FakeLocationsCharactersRepository;
let fakeLocationsRepository: FakeLocationsRepository;
let fakeCharactersRepository: FakeCharactersRepository;
let fakeUsersRepository: FakeUsersRepository;
let getCharacterLocation: GetCharacterLocationService;

describe('GetCharacterLocation', () => {
  beforeEach(() => {
    fakeLocationsCharactersRepository = new FakeLocationsCharactersRepository();
    fakeLocationsRepository = new FakeLocationsRepository();
    fakeCharactersRepository = new FakeCharactersRepository();
    fakeUsersRepository = new FakeUsersRepository();

    getCharacterLocation = new GetCharacterLocationService(
      fakeLocationsCharactersRepository,
      fakeUsersRepository,
      fakeLocationsRepository,
      fakeCharactersRepository,
    );
  });

  it('Should be able to get a character-location', async () => {
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

    const location = await fakeLocationsRepository.create({
      name: 'Prefeitura de Curitiba',
      description: 'Prefeitura Municipal de Curitiba',
      latitude: -25.4166496,
      longitude: -49.2713069,
    });

    const locChar = await fakeLocationsCharactersRepository.addCharToLocation(
      char.id,
      location.id,
    );

    const charLocLocaded = await getCharacterLocation.execute({
      user_id: user.id,
      char_id: char.id,
      location_id: location.id,
    });

    expect(charLocLocaded).toMatchObject({
      id: locChar.id,
      character_id: locChar.character_id,
      location_id: locChar.location_id,
    });
  });

  it('Should not allow invalid users to get character-location', async () => {
    await expect(
      getCharacterLocation.execute({
        user_id: 'I am invalid',
        char_id: 'Does not matter',
        location_id: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow to get a character-location for a non existant character', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      getCharacterLocation.execute({
        user_id: user.id,
        char_id: 'I do not exist',
        location_id: 'Does not matter',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow to get a character-location for a non existant location', async () => {
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

    await expect(
      getCharacterLocation.execute({
        user_id: user.id,
        char_id: char.id,
        location_id: 'I do not exist',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow a user get character-location for another user character', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const notStUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
    });

    const char = await fakeCharactersRepository.create({
      user_id: user.id,
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
    });

    const location = await fakeLocationsRepository.create({
      name: 'Prefeitura de Curitiba',
      description: 'Prefeitura Municipal de Curitiba',
      latitude: -25.4166496,
      longitude: -49.2713069,
    });

    await expect(
      getCharacterLocation.execute({
        user_id: notStUser.id,
        char_id: char.id,
        location_id: location.id,
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should be able to get a character-location', async () => {
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

    const location = await fakeLocationsRepository.create({
      name: 'Prefeitura de Curitiba',
      description: 'Prefeitura Municipal de Curitiba',
      latitude: -25.4166496,
      longitude: -49.2713069,
    });

    await expect(
      getCharacterLocation.execute({
        user_id: user.id,
        char_id: char.id,
        location_id: location.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
