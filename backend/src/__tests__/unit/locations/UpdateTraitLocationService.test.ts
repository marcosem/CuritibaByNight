import 'reflect-metadata';
import FakeLocationAvailableTraitsRepository from '@modules/locations/repositories/fakes/FakeLocationAvailableTraitsRepository';
import FakeLocationsTraitsRepository from '@modules/locations/repositories/fakes/FakeLocationsTraitsRepository';
import FakeLocationsRepository from '@modules/locations/repositories/fakes/FakeLocationsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import LocationTrait from '@modules/locations/infra/typeorm/entities/LocationTrait';
import UpdateTraitLocationService from '@modules/locations/services/UpdateTraitLocationService';
import AppError from '@shared/errors/AppError';

let fakeLocationAvailableTraitsRepository: FakeLocationAvailableTraitsRepository;
let fakeLocationsTraitsRepository: FakeLocationsTraitsRepository;
let fakeLocationsRepository: FakeLocationsRepository;
let fakeUsersRepository: FakeUsersRepository;
let updateTraitLocation: UpdateTraitLocationService;

describe('updateTraitLocationService', () => {
  beforeAll(async () => {
    fakeLocationAvailableTraitsRepository = new FakeLocationAvailableTraitsRepository();

    const traitsList = [
      {
        trait: 'Enigmas',
        type: 'abilities',
      },
      {
        trait: 'Academics',
        type: 'abilities',
      },
      {
        trait: 'Medicine',
        type: 'abilities',
      },
      {
        trait: 'Resources',
        type: 'backgrounds',
      },
      {
        trait: 'Allies',
        type: 'backgrounds',
      },
      {
        trait: 'Media',
        type: 'influences',
      },
    ];

    await fakeLocationAvailableTraitsRepository.createList(traitsList);
  });

  beforeEach(() => {
    fakeLocationsTraitsRepository = new FakeLocationsTraitsRepository();
    fakeLocationsRepository = new FakeLocationsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    updateTraitLocation = new UpdateTraitLocationService(
      fakeLocationAvailableTraitsRepository,
      fakeLocationsTraitsRepository,
      fakeLocationsRepository,
      fakeUsersRepository,
    );
  });

  it('Should be able to add a new trait to a location', async () => {
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

    const availableTrait = await fakeLocationAvailableTraitsRepository.findLocationAvailableTraitByNameType(
      'Enigmas',
      'abilities',
    );

    const newTrait = {
      id: availableTrait?.id || '',
      trait: availableTrait?.trait || '',
      type: availableTrait?.type || '',
    };

    const newTraitLocation = await updateTraitLocation.execute({
      user_id: user.id,
      trait_id: newTrait.id,
      location_id: location.id,
    });

    const templateTraitLocation: LocationTrait = {
      id: expect.any(String),
      location_id: location.id,
      trait_id: newTrait.id,
      level: 1,
    } as LocationTrait;

    expect(newTraitLocation).toMatchObject(templateTraitLocation);
  });

  it('Should be able to add a new trait with specific level to a location', async () => {
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
      level: 4,
    });

    const availableTrait = await fakeLocationAvailableTraitsRepository.findLocationAvailableTraitByNameType(
      'Enigmas',
      'abilities',
    );

    const newTrait = {
      id: availableTrait?.id || '',
      trait: availableTrait?.trait || '',
      type: availableTrait?.type || '',
    };

    const newTraitLocation = await updateTraitLocation.execute({
      user_id: user.id,
      trait_id: newTrait.id,
      location_id: location.id,
      level: 3,
    });

    const templateTraitLocation: LocationTrait = {
      id: expect.any(String),
      location_id: location.id,
      trait_id: newTrait.id,
      level: 3,
    } as LocationTrait;

    expect(newTraitLocation).toMatchObject(templateTraitLocation);
  });

  it('Should be able to update a trait of a location by one level up', async () => {
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
      level: 4,
    });

    const availableTrait = await fakeLocationAvailableTraitsRepository.findLocationAvailableTraitByNameType(
      'Enigmas',
      'abilities',
    );

    const newTrait = {
      id: availableTrait?.id || '',
      trait: availableTrait?.trait || '',
      type: availableTrait?.type || '',
    };

    await fakeLocationsTraitsRepository.addTraitToLocation({
      location_id: location.id,
      trait_id: newTrait.id,
      level: 1,
    });

    const newTraitLocation = await updateTraitLocation.execute({
      user_id: user.id,
      trait_id: newTrait.id,
      location_id: location.id,
    });

    const templateTraitLocation: LocationTrait = {
      id: expect.any(String),
      location_id: location.id,
      trait_id: newTrait.id,
      level: 2,
    } as LocationTrait;

    expect(newTraitLocation).toMatchObject(templateTraitLocation);
  });

  it('Should be able to update a trait of a location by one level down', async () => {
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
      level: 4,
    });

    const availableTrait = await fakeLocationAvailableTraitsRepository.findLocationAvailableTraitByNameType(
      'Enigmas',
      'abilities',
    );

    const newTrait = {
      id: availableTrait?.id || '',
      trait: availableTrait?.trait || '',
      type: availableTrait?.type || '',
    };

    await fakeLocationsTraitsRepository.addTraitToLocation({
      location_id: location.id,
      trait_id: newTrait.id,
      level: 3,
    });

    const newTraitLocation = await updateTraitLocation.execute({
      user_id: user.id,
      trait_id: newTrait.id,
      location_id: location.id,
      level: -1,
    });

    const templateTraitLocation: LocationTrait = {
      id: expect.any(String),
      location_id: location.id,
      trait_id: newTrait.id,
      level: 2,
    } as LocationTrait;

    expect(newTraitLocation).toMatchObject(templateTraitLocation);
  });

  it('Should be able to remove a trait of a location by set its level to zero', async () => {
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

    const availableTrait = await fakeLocationAvailableTraitsRepository.findLocationAvailableTraitByNameType(
      'Enigmas',
      'abilities',
    );

    const newTrait = {
      id: availableTrait?.id || '',
      trait: availableTrait?.trait || '',
      type: availableTrait?.type || '',
    };

    await fakeLocationsTraitsRepository.addTraitToLocation({
      location_id: location.id,
      trait_id: newTrait.id,
      level: 1,
    });

    const locationTraitListBefore = await fakeLocationsTraitsRepository.listTraitsByLocation(
      location.id,
    );

    const newTraitLocation = await updateTraitLocation.execute({
      user_id: user.id,
      trait_id: newTrait.id,
      location_id: location.id,
      level: -1,
    });

    const templateTraitLocation: LocationTrait = {
      id: '',
      location_id: location.id,
      trait_id: newTrait.id,
      level: 0,
    } as LocationTrait;

    const locationTraitListAfter = await fakeLocationsTraitsRepository.listTraitsByLocation(
      location.id,
    );

    expect(newTraitLocation).toMatchObject(templateTraitLocation);
    expect(locationTraitListAfter).toHaveLength(
      locationTraitListBefore.length - 1,
    );
  });

  it('Should be able to remove a trait of a location by set its level to lower than zero', async () => {
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

    const availableTrait = await fakeLocationAvailableTraitsRepository.findLocationAvailableTraitByNameType(
      'Enigmas',
      'abilities',
    );

    const newTrait = {
      id: availableTrait?.id || '',
      trait: availableTrait?.trait || '',
      type: availableTrait?.type || '',
    };

    await fakeLocationsTraitsRepository.addTraitToLocation({
      location_id: location.id,
      trait_id: newTrait.id,
      level: 1,
    });

    const locationTraitListBefore = await fakeLocationsTraitsRepository.listTraitsByLocation(
      location.id,
    );

    const newTraitLocation = await updateTraitLocation.execute({
      user_id: user.id,
      trait_id: newTrait.id,
      location_id: location.id,
      level: -5,
    });

    const templateTraitLocation: LocationTrait = {
      id: '',
      location_id: location.id,
      trait_id: newTrait.id,
      level: 0,
    } as LocationTrait;

    const locationTraitListAfter = await fakeLocationsTraitsRepository.listTraitsByLocation(
      location.id,
    );

    expect(newTraitLocation).toMatchObject(templateTraitLocation);
    expect(locationTraitListAfter).toHaveLength(
      locationTraitListBefore.length - 1,
    );
  });

  it('Should set new trait level to location capacity if higher', async () => {
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
      level: 3,
    });

    const availableTrait = await fakeLocationAvailableTraitsRepository.findLocationAvailableTraitByNameType(
      'Enigmas',
      'abilities',
    );

    const newTrait = {
      id: availableTrait?.id || '',
      trait: availableTrait?.trait || '',
      type: availableTrait?.type || '',
    };

    const newTraitLocation = await updateTraitLocation.execute({
      user_id: user.id,
      trait_id: newTrait.id,
      location_id: location.id,
      level: 5,
    });

    const templateTraitLocation: LocationTrait = {
      id: expect.any(String),
      location_id: location.id,
      trait_id: newTrait.id,
      level: 3,
    } as LocationTrait;

    expect(newTraitLocation).toMatchObject(templateTraitLocation);
  });

  it('Should update trait level to location capacity if higher', async () => {
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
      level: 3,
    });

    const availableTrait = await fakeLocationAvailableTraitsRepository.findLocationAvailableTraitByNameType(
      'Enigmas',
      'abilities',
    );

    const newTrait = {
      id: availableTrait?.id || '',
      trait: availableTrait?.trait || '',
      type: availableTrait?.type || '',
    };

    await fakeLocationsTraitsRepository.addTraitToLocation({
      location_id: location.id,
      trait_id: newTrait.id,
      level: 1,
    });

    const newTraitLocation = await updateTraitLocation.execute({
      user_id: user.id,
      trait_id: newTrait.id,
      location_id: location.id,
      level: 5,
    });

    const templateTraitLocation: LocationTrait = {
      id: expect.any(String),
      location_id: location.id,
      trait_id: newTrait.id,
      level: 3,
    } as LocationTrait;

    expect(newTraitLocation).toMatchObject(templateTraitLocation);
  });

  it('Should not allow invalid user to add/update traits of a location', async () => {
    await expect(
      updateTraitLocation.execute({
        user_id: 'I am invalid',
        trait_id: 'Does not matter',
        location_id: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow non storyteller user to add/update traits of a location', async () => {
    const noStUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
    });

    await expect(
      updateTraitLocation.execute({
        user_id: noStUser.id,
        trait_id: 'Does not matter',
        location_id: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow to add/update a trait of a non existant location', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      updateTraitLocation.execute({
        user_id: user.id,
        trait_id: 'Does not matter',
        location_id: 'Does not matter',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow to add an invalid trait to a location', async () => {
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
      level: 3,
    });

    await expect(
      updateTraitLocation.execute({
        user_id: user.id,
        trait_id: 'Does not matter',
        location_id: location.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
