import 'reflect-metadata';
import FakeLocationsAddonsRepository from '@modules/locations/repositories/fakes/FakeLocationsAddonsRepository';
import FakeLocationsRepository from '@modules/locations/repositories/fakes/FakeLocationsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import RemoveAddonFromLocationService from '@modules/locations/services/RemoveAddonFromLocationService';
import AppError from '@shared/errors/AppError';

let fakeLocationsAddonsRepository: FakeLocationsAddonsRepository;
let fakeLocationsRepository: FakeLocationsRepository;
let fakeUsersRepository: FakeUsersRepository;
let removeAddonFromLocation: RemoveAddonFromLocationService;

describe('RemoveAddonFromLocation', () => {
  beforeEach(() => {
    fakeLocationsAddonsRepository = new FakeLocationsAddonsRepository();
    fakeLocationsRepository = new FakeLocationsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    removeAddonFromLocation = new RemoveAddonFromLocationService(
      fakeLocationsAddonsRepository,
      fakeLocationsRepository,
      fakeUsersRepository,
    );
  });

  it('Should be able to remove an addon from a location', async () => {
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

    await fakeLocationsAddonsRepository.addAddonToLocation({
      addon_name: 'My Addon #1',
      addon_level: 3,
      location_id: location.id,
      addon_id_current: 'Current Id',
      addon_id_next: 'Next Id',
      temp_ability: 0,
      temp_influence: 0,
    });

    await fakeLocationsAddonsRepository.addAddonToLocation({
      addon_name: 'My Addon #2',
      addon_level: 4,
      location_id: location.id,
      addon_id_current: 'Current Id',
      addon_id_next: 'Next Id',
      temp_ability: 0,
      temp_influence: 0,
    });

    const addonListBeforeRemove = await fakeLocationsAddonsRepository.listAddonsByLocation(
      location.id,
    );

    await removeAddonFromLocation.execute({
      user_id: user.id,
      addon_name: 'My Addon #1',
      location_id: location.id,
    });

    const addonListAfterRemove = await fakeLocationsAddonsRepository.listAddonsByLocation(
      location.id,
    );
    const removedAddon = await fakeLocationsAddonsRepository.findInLocationByAddonName(
      location.id,
      'My Addon #1',
    );

    expect(addonListAfterRemove).toHaveLength(addonListBeforeRemove.length - 1);
    expect(removedAddon).toBeUndefined();
  });

  it('Should not allow invalid user to remove addon from a location', async () => {
    await expect(
      removeAddonFromLocation.execute({
        user_id: 'I am invalid',
        location_id: 'Does not matter',
        addon_name: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow non storyteller user to remove addon from a location', async () => {
    const noStUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
    });

    await expect(
      removeAddonFromLocation.execute({
        user_id: noStUser.id,
        location_id: 'Does not matter',
        addon_name: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow to remove addon from non existant location', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      removeAddonFromLocation.execute({
        user_id: user.id,
        location_id: 'I am invalid',
        addon_name: 'Does not matter',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow to remove a non existant addon from a location', async () => {
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
      removeAddonFromLocation.execute({
        user_id: user.id,
        location_id: location.id,
        addon_name: 'Does not matter',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  /*
  it('Should not allow to update addon of a non existant location', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      updateAddonLocation.execute({
        user_id: user.id,
        location_id: 'I am invalid',
        addon_name: 'Does not matter',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow to update a non existant addon of a location', async () => {
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
      updateAddonLocation.execute({
        user_id: user.id,
        location_id: location.id,
        addon_name: 'I do not exist',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow to update an addon of a location to a non existant level', async () => {
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

    const addonCurrent = await fakeAddonsRepository.findByNameLevel(
      'Aeroporto/Heliporto',
      1,
      false,
    );

    const addonNext = await fakeAddonsRepository.findByNameLevel(
      'Aeroporto/Heliporto',
      2,
      false,
    );

    await fakeLocationsAddonsRepository.addAddonToLocation({
      addon_name: addonCurrent?.name || '',
      addon_level: 1,
      location_id: location.id,
      addon_id_current: addonCurrent?.id || null,
      addon_id_next: addonNext?.id || null,
      temp_ability: 0,
      temp_influence: 0,
    });

    await expect(
      updateAddonLocation.execute({
        user_id: user.id,
        addon_name: addonCurrent?.name || '',
        location_id: location.id,
        addon_level: 3,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  */
});
