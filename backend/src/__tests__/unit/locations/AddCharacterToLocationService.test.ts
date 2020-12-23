import 'reflect-metadata';
import FakeLocationsCharactersRepository from '@modules/locations/repositories/fakes/FakeLocationsCharactersRepository';
import FakeLocationsRepository from '@modules/locations/repositories/fakes/FakeLocationsRepository';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AddCharacterToLocationService from '@modules/locations/services/AddCharacterToLocationService';
import AppError from '@shared/errors/AppError';

let fakeLocationsCharactersRepository: FakeLocationsCharactersRepository;
let fakeLocationsRepository: FakeLocationsRepository;
let fakeCharactersRepository: FakeCharactersRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let addCharacterToLocation: AddCharacterToLocationService;

describe('AddCharacterToLocation', () => {
  beforeEach(() => {
    fakeLocationsCharactersRepository = new FakeLocationsCharactersRepository();
    fakeLocationsRepository = new FakeLocationsRepository();
    fakeCharactersRepository = new FakeCharactersRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();

    addCharacterToLocation = new AddCharacterToLocationService(
      fakeLocationsCharactersRepository,
      fakeUsersRepository,
      fakeLocationsRepository,
      fakeCharactersRepository,
      fakeMailProvider,
    );
  });

  it('Should be able to add a character to a location', async () => {
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
      clan: 'Tzimisce',
      experience: 666,
      file: 'dracula.pdf',
    });

    const location = await fakeLocationsRepository.create({
      name: 'Prefeitura de Curitiba',
      description: 'Prefeitura Municipal de Curitiba',
      latitude: -25.4166496,
      longitude: -49.2713069,
    });

    const locChar = await addCharacterToLocation.execute({
      user_id: user.id,
      char_id: char.id,
      location_id: location.id,
    });

    expect(locChar).toHaveProperty('id');
    expect(locChar).toMatchObject({
      character_id: char.id,
      location_id: location.id,
    });
    expect(sendMail).toHaveBeenCalled();
  });

  it('Should not allow invalid user to add character to a location', async () => {
    await expect(
      addCharacterToLocation.execute({
        user_id: 'I am invalid',
        char_id: 'Does not matter',
        location_id: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow non storyteller user to add character to a location', async () => {
    const noStUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
    });

    await expect(
      addCharacterToLocation.execute({
        user_id: noStUser.id,
        char_id: 'Does not matter',
        location_id: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow add a non existant character to a location', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      addCharacterToLocation.execute({
        user_id: user.id,
        char_id: 'I do not exist',
        location_id: 'Does not matter',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow add a character to a non existant location', async () => {
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
      addCharacterToLocation.execute({
        user_id: user.id,
        char_id: char.id,
        location_id: 'I do not exist',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow to add a character to the same location more than once', async () => {
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

    await addCharacterToLocation.execute({
      user_id: user.id,
      char_id: char.id,
      location_id: location.id,
    });

    await expect(
      addCharacterToLocation.execute({
        user_id: user.id,
        char_id: char.id,
        location_id: location.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow to add a character to location on his responsability', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const char = await fakeCharactersRepository.create({
      user_id: user.id,
      name: 'Dracula',
      clan: 'Tzimisce',
      experience: 666,
      file: 'dracula.pdf',
    });

    const location = await fakeLocationsRepository.create({
      name: 'Prefeitura de Curitiba',
      description: 'Prefeitura Municipal de Curitiba',
      latitude: -25.4166496,
      longitude: -49.2713069,
      responsible: char.id,
    });

    await expect(
      addCharacterToLocation.execute({
        user_id: user.id,
        char_id: char.id,
        location_id: location.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow to add a character to a public location', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const char = await fakeCharactersRepository.create({
      user_id: user.id,
      name: 'Dracula',
      clan: 'Tzimisce',
      experience: 666,
      file: 'dracula.pdf',
    });

    const location = await fakeLocationsRepository.create({
      name: 'Prefeitura de Curitiba',
      description: 'Prefeitura Municipal de Curitiba',
      latitude: -25.4166496,
      longitude: -49.2713069,
      property: 'public',
    });

    await expect(
      addCharacterToLocation.execute({
        user_id: user.id,
        char_id: char.id,
        location_id: location.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow to add a character to a elysium', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const char = await fakeCharactersRepository.create({
      user_id: user.id,
      name: 'Dracula',
      clan: 'Tzimisce',
      experience: 666,
      file: 'dracula.pdf',
    });

    const location = await fakeLocationsRepository.create({
      name: 'Prefeitura de Curitiba',
      description: 'Prefeitura Municipal de Curitiba',
      latitude: -25.4166496,
      longitude: -49.2713069,
      elysium: true,
    });

    await expect(
      addCharacterToLocation.execute({
        user_id: user.id,
        char_id: char.id,
        location_id: location.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow to add a character to location of his own clan', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const char = await fakeCharactersRepository.create({
      user_id: user.id,
      name: 'Dracula',
      clan: 'Tzimisce',
      experience: 666,
      file: 'dracula.pdf',
    });

    const location = await fakeLocationsRepository.create({
      name: 'Prefeitura de Curitiba',
      description: 'Prefeitura Municipal de Curitiba',
      latitude: -25.4166496,
      longitude: -49.2713069,
      clan: 'Tzimisce',
    });

    await expect(
      addCharacterToLocation.execute({
        user_id: user.id,
        char_id: char.id,
        location_id: location.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not send email if player was not found', async () => {
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
      clan: 'Tzimisce',
      experience: 666,
      file: 'dracula.pdf',
    });

    const location = await fakeLocationsRepository.create({
      name: 'Prefeitura de Curitiba',
      description: 'Prefeitura Municipal de Curitiba',
      latitude: -25.4166496,
      longitude: -49.2713069,
    });

    jest
      .spyOn(fakeUsersRepository, 'findById')
      .mockImplementation(() => Promise.resolve(user))
      .mockImplementationOnce(() => Promise.resolve(user))
      .mockImplementationOnce(() => Promise.resolve(undefined));

    await addCharacterToLocation.execute({
      user_id: user.id,
      char_id: char.id,
      location_id: location.id,
    });

    expect(sendMail).not.toHaveBeenCalled();
  });
});
