import 'reflect-metadata';
import FakeLocationAvailableTraitsRepository from '@modules/locations/repositories/fakes/FakeLocationAvailableTraitsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AddLocationAvailableTraitsService from '@modules/locations/services/AddLocationAvailableTraitsService';
import LocationAvailableTrait from '@modules/locations/infra/typeorm/entities/LocationAvailableTrait';
import AppError from '@shared/errors/AppError';

let fakeLocationAvailableTraitsRepository: FakeLocationAvailableTraitsRepository;
let fakeUsersRepository: FakeUsersRepository;
let addLocationAvailableTraits: AddLocationAvailableTraitsService;

describe('AddLocationAvailableTraits', () => {
  beforeEach(() => {
    fakeLocationAvailableTraitsRepository = new FakeLocationAvailableTraitsRepository();
    fakeUsersRepository = new FakeUsersRepository();

    addLocationAvailableTraits = new AddLocationAvailableTraitsService(
      fakeLocationAvailableTraitsRepository,
      fakeUsersRepository,
    );
  });

  it('Should be able to add a list of location available traits', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

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
    ] as LocationAvailableTrait[];

    const traitsListResult = await addLocationAvailableTraits.execute({
      user_id: user.id,
      loc_avai_traits: traitsList,
    });

    expect(traitsListResult).toHaveLength(6);
    expect(traitsListResult).not.toBeUndefined();
  });

  it('Should not add duplicate trait to location available traits list', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

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
    ] as LocationAvailableTrait[];

    await addLocationAvailableTraits.execute({
      user_id: user.id,
      loc_avai_traits: traitsList,
    });

    const traitsListResult = await addLocationAvailableTraits.execute({
      user_id: user.id,
      loc_avai_traits: traitsList,
    });

    expect(traitsListResult).toHaveLength(0);
    expect(traitsListResult).not.toBeUndefined();
  });

  it('Should not allow to add a empty list to location available traits list', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      addLocationAvailableTraits.execute({
        user_id: user.id,
        loc_avai_traits: [] as LocationAvailableTrait[],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow invalid users to add trait to location available traits list', async () => {
    await expect(
      addLocationAvailableTraits.execute({
        user_id: 'I do not exist',
        loc_avai_traits: [] as LocationAvailableTrait[],
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow non storyteller user to add trait to location available traits list', async () => {
    const notStUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
    });

    await expect(
      addLocationAvailableTraits.execute({
        user_id: notStUser.id,
        loc_avai_traits: [] as LocationAvailableTrait[],
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});
