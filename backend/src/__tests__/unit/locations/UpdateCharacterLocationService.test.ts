import 'reflect-metadata';
import FakeLocationsCharactersRepository from '@modules/locations/repositories/fakes/FakeLocationsCharactersRepository';
import FakeLocationsRepository from '@modules/locations/repositories/fakes/FakeLocationsRepository';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import UpdateCharacterLocationService from '@modules/locations/services/UpdateCharacterLocationService';
import AppError from '@shared/errors/AppError';

let fakeLocationsCharactersRepository: FakeLocationsCharactersRepository;
let fakeLocationsRepository: FakeLocationsRepository;
let fakeCharactersRepository: FakeCharactersRepository;
let fakeUsersRepository: FakeUsersRepository;
let updateCharacterLocation: UpdateCharacterLocationService;

describe('UpdateCharacterLocation', () => {
  beforeEach(() => {
    fakeLocationsCharactersRepository = new FakeLocationsCharactersRepository();
    fakeLocationsRepository = new FakeLocationsRepository();
    fakeCharactersRepository = new FakeCharactersRepository();
    fakeUsersRepository = new FakeUsersRepository();

    updateCharacterLocation = new UpdateCharacterLocationService(
      fakeLocationsCharactersRepository,
      fakeUsersRepository,
      fakeLocationsRepository,
      fakeCharactersRepository,
    );
  });

  it('Should be able to update shared status from a character in a location', async () => {
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

    const initialCharLoc = await fakeLocationsCharactersRepository.addCharToLocation(
      char.id,
      location.id,
      false,
    );

    const initialSharedStatus = initialCharLoc.shared;

    const newCharLoc = await updateCharacterLocation.execute({
      user_id: user.id,
      char_id: char.id,
      location_id: location.id,
      shared: true,
    });

    expect(newCharLoc.shared).not.toEqual(initialSharedStatus);
    expect(newCharLoc.shared).toBeTruthy();
  });

  it('Should remove a character-location when the character is naturally aware of a public location and lose its shared status', async () => {
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
      property: 'public',
    });

    await fakeLocationsCharactersRepository.addCharToLocation(
      char.id,
      location.id,
      true,
    );

    const initialListSize = await fakeLocationsCharactersRepository.listCharactersByLocation(
      location.id,
    );

    await expect(
      updateCharacterLocation.execute({
        user_id: user.id,
        char_id: char.id,
        location_id: location.id,
        shared: false,
      }),
    ).rejects.toBeInstanceOf(AppError);

    const finalListSize = await fakeLocationsCharactersRepository.listCharactersByLocation(
      location.id,
    );
    const findLocChar = await fakeLocationsCharactersRepository.find(
      char.id,
      location.id,
    );

    expect(finalListSize).toHaveLength(initialListSize.length - 1);
    expect(findLocChar).toBeUndefined();
  });

  it('Should remove a character-location when the character is naturally aware of a clan location and lose its shared status', async () => {
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
      clan: 'Tzimisce',
      npc: false,
    });

    const location = await fakeLocationsRepository.create({
      name: 'Prefeitura de Curitiba',
      description: 'Prefeitura Municipal de Curitiba',
      latitude: -25.4166496,
      longitude: -49.2713069,
      property: 'clan',
      clan: 'Tzimisce',
    });

    await fakeLocationsCharactersRepository.addCharToLocation(
      char.id,
      location.id,
      true,
    );

    const initialListSize = await fakeLocationsCharactersRepository.listCharactersByLocation(
      location.id,
    );

    await expect(
      updateCharacterLocation.execute({
        user_id: user.id,
        char_id: char.id,
        location_id: location.id,
        shared: false,
      }),
    ).rejects.toBeInstanceOf(AppError);

    const finalListSize = await fakeLocationsCharactersRepository.listCharactersByLocation(
      location.id,
    );
    const findLocChar = await fakeLocationsCharactersRepository.find(
      char.id,
      location.id,
    );

    expect(finalListSize).toHaveLength(initialListSize.length - 1);
    expect(findLocChar).toBeUndefined();
  });

  it('Should remove a character-location when the character is naturally aware of a creature type location and lose its shared status', async () => {
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
      creature_type: 'Vampire',
      clan: 'Tzimisce',
      sect: 'Sabbat',
      npc: false,
    });

    const location = await fakeLocationsRepository.create({
      name: 'Prefeitura de Curitiba',
      description: 'Prefeitura Municipal de Curitiba',
      latitude: -25.4166496,
      longitude: -49.2713069,
      property: 'private',
      clan: 'Ventrue',
      sect: 'Camarilla',
      creature_type: 'Vampire',
    });

    await fakeLocationsCharactersRepository.addCharToLocation(
      char.id,
      location.id,
      true,
    );

    const initialListSize = await fakeLocationsCharactersRepository.listCharactersByLocation(
      location.id,
    );

    await expect(
      updateCharacterLocation.execute({
        user_id: user.id,
        char_id: char.id,
        location_id: location.id,
        shared: false,
      }),
    ).rejects.toBeInstanceOf(AppError);

    const finalListSize = await fakeLocationsCharactersRepository.listCharactersByLocation(
      location.id,
    );
    const findLocChar = await fakeLocationsCharactersRepository.find(
      char.id,
      location.id,
    );

    expect(finalListSize).toHaveLength(initialListSize.length - 1);
    expect(findLocChar).toBeUndefined();
  });

  it('Should remove a character-location when the character is naturally aware of a sect location and lose its shared status', async () => {
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
      sect: 'Sabbat',
      clan: 'Tzimisce',
      npc: false,
      creature_type: 'Vampire',
    });

    const location = await fakeLocationsRepository.create({
      name: 'Prefeitura de Curitiba',
      description: 'Prefeitura Municipal de Curitiba',
      latitude: -25.4166496,
      longitude: -49.2713069,
      property: 'private',
      clan: 'Ventrue',
      sect: 'Sabbat',
    });

    await fakeLocationsCharactersRepository.addCharToLocation(
      char.id,
      location.id,
      true,
    );

    const initialListSize = await fakeLocationsCharactersRepository.listCharactersByLocation(
      location.id,
    );

    await expect(
      updateCharacterLocation.execute({
        user_id: user.id,
        char_id: char.id,
        location_id: location.id,
        shared: false,
      }),
    ).rejects.toBeInstanceOf(AppError);

    const finalListSize = await fakeLocationsCharactersRepository.listCharactersByLocation(
      location.id,
    );
    const findLocChar = await fakeLocationsCharactersRepository.find(
      char.id,
      location.id,
    );

    expect(finalListSize).toHaveLength(initialListSize.length - 1);
    expect(findLocChar).toBeUndefined();
  });

  it('Should not allow invalid user to update character-location', async () => {
    await expect(
      updateCharacterLocation.execute({
        user_id: 'I am invalid',
        char_id: 'Does not matter',
        location_id: 'Does not matter',
        shared: false,
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow non storyteller user to update character-location', async () => {
    const noStUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
    });

    await expect(
      updateCharacterLocation.execute({
        user_id: noStUser.id,
        char_id: 'Does not matter',
        location_id: 'Does not matter',
        shared: false,
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow to update character shared status from a location that is not there', async () => {
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
      updateCharacterLocation.execute({
        user_id: user.id,
        char_id: char.id,
        location_id: location.id,
        shared: false,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow to update character-location for an invalid character', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      updateCharacterLocation.execute({
        user_id: user.id,
        char_id: 'Invalid Character',
        location_id: 'Does not matter',
        shared: false,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow to update character-location for an invalid location', async () => {
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

    await expect(
      updateCharacterLocation.execute({
        user_id: user.id,
        char_id: char.id,
        location_id: 'Invalid Location',
        shared: false,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
