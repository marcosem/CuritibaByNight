import 'reflect-metadata';
import FakeLocationAvailableTraitsRepository from '@modules/locations/repositories/fakes/FakeLocationAvailableTraitsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import GetLocationAvailableTraitsService from '@modules/locations/services/GetLocationAvailableTraitsService';

let fakeLocationAvailableTraitsRepository: FakeLocationAvailableTraitsRepository;
let fakeUsersRepository: FakeUsersRepository;
let getLocationAvailableTraits: GetLocationAvailableTraitsService;

describe('GetLocationAvailableTraits', () => {
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

    // eslint-disable-next-line no-restricted-syntax
    for (const myTrait of traitsList) {
      // eslint-disable-next-line no-await-in-loop
      await fakeLocationAvailableTraitsRepository.create(myTrait);
    }
  });

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    getLocationAvailableTraits = new GetLocationAvailableTraitsService(
      fakeLocationAvailableTraitsRepository,
      fakeUsersRepository,
    );
  });

  it('Should be able to get a list of location available traits', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const locAvaiTraitsLoaded = await getLocationAvailableTraits.execute({
      user_id: user.id,
      trait_type: 'abilities',
    });

    expect(locAvaiTraitsLoaded).toHaveLength(3);
    expect(locAvaiTraitsLoaded[0].type).toBe('abilities');
    expect(locAvaiTraitsLoaded[1].type).toBe('abilities');
    expect(locAvaiTraitsLoaded[2].type).toBe('abilities');
  });

  it('Should be able to get a full list of location available traits', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const locAvaiTraitsFullLoaded1 = await getLocationAvailableTraits.execute({
      user_id: user.id,
      trait_type: '',
    });
    const locAvaiTraitsFullLoaded2 = await getLocationAvailableTraits.execute({
      user_id: user.id,
    });

    expect(locAvaiTraitsFullLoaded1).toHaveLength(6);
    expect(locAvaiTraitsFullLoaded2).toHaveLength(
      locAvaiTraitsFullLoaded1.length,
    );
    expect(locAvaiTraitsFullLoaded1).toEqual(locAvaiTraitsFullLoaded2);
  });

  it('Should not allow invalid users to get a list of location available traits', async () => {
    await expect(
      getLocationAvailableTraits.execute({
        user_id: 'I do not exist',
        trait_type: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow non storyteller user to get a list of location available traits', async () => {
    const notStUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
    });

    await expect(
      getLocationAvailableTraits.execute({
        user_id: notStUser.id,
        trait_type: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});
