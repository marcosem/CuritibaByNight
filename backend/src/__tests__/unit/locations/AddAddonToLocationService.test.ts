import 'reflect-metadata';
import FakeAddonsRepository from '@modules/locations/repositories/fakes/FakeAddonsRepository';
import FakeLocationsAddonsRepository from '@modules/locations/repositories/fakes/FakeLocationsAddonsRepository';
import FakeLocationsRepository from '@modules/locations/repositories/fakes/FakeLocationsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import LocationAddon from '@modules/locations/infra/typeorm/entities/LocationAddon';
import AddAddonToLocationService from '@modules/locations/services/AddAddonToLocationService';
import AppError from '@shared/errors/AppError';

let fakeAddonsRepository: FakeAddonsRepository;
let fakeLocationsAddonsRepository: FakeLocationsAddonsRepository;
let fakeLocationsRepository: FakeLocationsRepository;
let fakeUsersRepository: FakeUsersRepository;
let addAddonToLocation: AddAddonToLocationService;

describe('AddAddonToLocation', () => {
  beforeAll(async () => {
    fakeAddonsRepository = new FakeAddonsRepository();

    await fakeAddonsRepository.create({
      name: 'Aeroporto/Heliporto',
      level: 1,
      description: 'Um heliporto para pequenos helicópteros.',
      defense: 0,
      surveillance: 0,
      req_background: 'Resources x5',
      req_merit: null,
      req_influence: null,
      req_other: null,
      req_addon_1: null,
      req_addon_2: null,
      req_addon_3: null,
      ability: 'Science: Engineering',
      ability_qty: 5,
      influence: 'Bureaucracy, Industry, Transportation',
      influence_qty: 7,
      time_qty: 2,
      time_type: 'weeks',
    });

    await fakeAddonsRepository.create({
      name: 'Aeroporto/Heliporto',
      level: 2,
      description: 'Um heliporto para helicópteros comerciais.',
      defense: 0,
      surveillance: 0,
      req_background: 'Resources x5',
      req_merit: null,
      req_influence: null,
      req_other: null,
      req_addon_1: null,
      req_addon_2: null,
      req_addon_3: null,
      ability: 'Science: Engineering',
      ability_qty: 10,
      influence: 'Bureaucracy, Industry, Transportation',
      influence_qty: 11,
      time_qty: 1,
      time_type: 'months',
    });

    await fakeAddonsRepository.create({
      name: 'Animais Defensores',
      level: 1,
      description: '4 animais.',
      defense: 1,
      surveillance: 0,
      req_background: null,
      req_merit: null,
      req_influence: null,
      req_other: null,
      req_addon_1: null,
      req_addon_2: null,
      req_addon_3: null,
      ability: 'Animal Ken',
      ability_qty: 2,
      influence: 'Bureaucracy, Street',
      influence_qty: 2,
      time_qty: 3,
      time_type: 'days',
    });

    await fakeAddonsRepository.create({
      name: 'Animais Defensores',
      level: 2,
      description: '8 animais.',
      defense: 2,
      surveillance: 0,
      req_background: null,
      req_merit: null,
      req_influence: null,
      req_other: null,
      req_addon_1: null,
      req_addon_2: null,
      req_addon_3: null,
      ability: 'Animal Ken',
      ability_qty: 6,
      influence: 'Bureaucracy, Street',
      influence_qty: 6,
      time_qty: 1,
      time_type: 'weeks',
    });

    await fakeAddonsRepository.create({
      name: 'Animais Defensores',
      level: 1,
      description: '4 animais.',
      defense: 1,
      surveillance: 0,
      req_background: null,
      req_merit: null,
      req_influence: null,
      req_other: 'Warrens Nosferatu',
      req_addon_1: 'Lagoa da Desova x3',
      req_addon_2: 'Rancho/Fazenda x2',
      req_addon_3: null,
      ability: 'Animal Ken',
      ability_qty: 1,
      influence: 'Bureaucracy, Street',
      influence_qty: 1,
      time_qty: 3,
      time_type: 'days',
    });

    await fakeAddonsRepository.create({
      name: 'Animais Defensores',
      level: 2,
      description: '8 animais.',
      defense: 2,
      surveillance: 0,
      req_background: null,
      req_merit: null,
      req_influence: null,
      req_other: 'Warrens Nosferatu',
      req_addon_1: 'Lagoa da Desova x3',
      req_addon_2: 'Rancho/Fazenda x2',
      req_addon_3: null,
      ability: 'Animal Ken',
      ability_qty: 3,
      influence: 'Bureaucracy, Street',
      influence_qty: 3,
      time_qty: 1,
      time_type: 'weeks',
    });

    await fakeAddonsRepository.create({
      name: 'Sistema de Barcos',
      level: 1,
      description:
        'Grande o suficiente para um caiaque, uma canoa ou um bote de borracha.',
      defense: 0,
      surveillance: 0,
      req_background: null,
      req_merit: null,
      req_influence: null,
      req_other: 'Warrens Nosferatu',
      req_addon_1: 'Túneis Extras x2',
      req_addon_2: 'Sistema Hídrico x4',
      req_addon_3: null,
      ability: 'Science: Engineering',
      ability_qty: 1,
      influence: 'Bureaucracy, Industry, Transportation',
      influence_qty: 5,
      time_qty: 1,
      time_type: 'weeks',
    });

    await fakeAddonsRepository.create({
      name: 'Sistema de Barcos',
      level: 2,
      description:
        'Grande o suficiente para um barco a remo, uma jangada grande, ou um barquinho a motor.',
      defense: 0,
      surveillance: 0,
      req_background: null,
      req_merit: null,
      req_influence: null,
      req_other: 'Warrens Nosferatu',
      req_addon_1: 'Túneis Extras x2',
      req_addon_2: 'Sistema Hídrico x4',
      req_addon_3: null,
      ability: 'Science: Engineering',
      ability_qty: 2,
      influence: 'Bureaucracy, Industry, Transportation',
      influence_qty: 5,
      time_qty: 1,
      time_type: 'weeks',
    });
  });

  beforeEach(() => {
    fakeLocationsAddonsRepository = new FakeLocationsAddonsRepository();
    fakeLocationsRepository = new FakeLocationsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    addAddonToLocation = new AddAddonToLocationService(
      fakeAddonsRepository,
      fakeLocationsAddonsRepository,
      fakeLocationsRepository,
      fakeUsersRepository,
    );
  });

  it('Should be able to add an addon to a location', async () => {
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
      creature_type: 'Mortal',
    });

    const addon = await fakeAddonsRepository.findByNameLevel(
      'Aeroporto/Heliporto',
      1,
      false,
    );

    const locationAddon = await addAddonToLocation.execute({
      user_id: user.id,
      location_id: location.id,
      addon_name: 'Aeroporto/Heliporto',
    });

    const templateLocationAddon: LocationAddon = {
      id: expect.any(String),
      location_id: location.id,
      addon_name: addon?.name,
      addon_level: 0,
      addon_id_current: null,
      addon_id_next: addon?.id,
      temp_ability: 0,
      temp_influence: 0,
    } as LocationAddon;

    expect(locationAddon).toHaveProperty('id');
    expect(locationAddon).toMatchObject(templateLocationAddon);
  });

  it('Should be able to add an addon and level to a location', async () => {
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
      creature_type: 'Mortal',
    });

    const addonLevel1 = await fakeAddonsRepository.findByNameLevel(
      'Animais Defensores',
      1,
      false,
    );

    const addonLevel2 = await fakeAddonsRepository.findByNameLevel(
      'Animais Defensores',
      2,
      false,
    );

    const locationAddon = await addAddonToLocation.execute({
      user_id: user.id,
      location_id: location.id,
      addon_name: 'Animais Defensores',
      addon_level: 1,
    });

    const templateLocationAddon: LocationAddon = {
      id: expect.any(String),
      location_id: location.id,
      addon_name: addonLevel1?.name,
      addon_level: 1,
      addon_id_current: addonLevel1?.id,
      addon_id_next: addonLevel2?.id,
      temp_ability: 0,
      temp_influence: 0,
    } as LocationAddon;

    expect(locationAddon).toHaveProperty('id');
    expect(locationAddon).toMatchObject(templateLocationAddon);
  });

  it('Should be able to add teh correct addon and level to warrens', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const location = await fakeLocationsRepository.create({
      name: 'Warrens Nosferatu',
      description: 'Warrens',
      latitude: -25.4166496,
      longitude: -49.2713069,
      property: 'clan',
      clan: 'Nosferatu',
    });

    const addonWarrens = await fakeAddonsRepository.findByNameLevel(
      'Animais Defensores',
      2,
      true,
    );

    const addonNotWarrens = await fakeAddonsRepository.findByNameLevel(
      'Animais Defensores',
      2,
      false,
    );

    const locationAddon = await addAddonToLocation.execute({
      user_id: user.id,
      location_id: location.id,
      addon_name: 'Animais Defensores',
      addon_level: 2,
    });

    const templateLocationAddon: LocationAddon = {
      id: expect.any(String),
      location_id: location.id,
      addon_name: addonWarrens?.name,
      addon_level: 2,
      addon_id_current: addonWarrens?.id,
      addon_id_next: null,
      temp_ability: 0,
      temp_influence: 0,
    } as LocationAddon;

    expect(locationAddon).toHaveProperty('id');
    expect(locationAddon).toMatchObject(templateLocationAddon);
    expect(locationAddon.addon_id_current).not.toEqual(addonNotWarrens?.id);
  });

  it('Should not allow to add a warrens addon to a non warrens location', async () => {
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
      creature_type: 'Mortal',
    });

    await expect(
      addAddonToLocation.execute({
        user_id: user.id,
        location_id: location.id,
        addon_name: 'Sistema de Barcos',
        addon_level: 2,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow invalid user to add addon to a location', async () => {
    await expect(
      addAddonToLocation.execute({
        user_id: 'I am invalid',
        location_id: 'Does not matter',
        addon_name: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow non storyteller user to add addon to a location', async () => {
    const noStUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
    });

    await expect(
      addAddonToLocation.execute({
        user_id: noStUser.id,
        location_id: 'Does not matter',
        addon_name: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow to add addon to a non existant location', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      addAddonToLocation.execute({
        user_id: user.id,
        location_id: 'I am invalid',
        addon_name: 'Does not matter',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow to add a non existant addon to location', async () => {
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
      creature_type: 'Mortal',
    });

    await expect(
      addAddonToLocation.execute({
        user_id: user.id,
        location_id: location.id,
        addon_name: 'I am invalid',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow to an already existant addon to a location', async () => {
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
      creature_type: 'Mortal',
    });

    const addon = await fakeAddonsRepository.findByNameLevel(
      'Aeroporto/Heliporto',
      1,
      false,
    );

    await fakeLocationsAddonsRepository.addAddonToLocation({
      addon_name: addon?.name || '',
      addon_level: 0,
      addon_id_current: null,
      addon_id_next: addon?.id || null,
      location_id: location.id,
      temp_ability: 0,
      temp_influence: 0,
    });

    await expect(
      addAddonToLocation.execute({
        user_id: user.id,
        location_id: location.id,
        addon_name: 'Aeroporto/Heliporto',
        addon_level: 2,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
