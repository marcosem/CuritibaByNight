import 'reflect-metadata';
import FakeLocationsRepository from '@modules/locations/repositories/fakes/FakeLocationsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import RemoveLocationService from '@modules/locations/services/RemoveLocationService';
import AppError from '@shared/errors/AppError';

let fakeLocationsRepository: FakeLocationsRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let removeLocation: RemoveLocationService;

describe('RemoveLocation', () => {
  beforeEach(() => {
    fakeLocationsRepository = new FakeLocationsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    removeLocation = new RemoveLocationService(
      fakeLocationsRepository,
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('Should be able to remove a location', async () => {
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
    });

    const initialListSize = await fakeLocationsRepository.listAll();

    await removeLocation.execute({
      user_id: user.id,
      location_id: location.id,
    });

    const finalListSize = await fakeLocationsRepository.listAll();
    const findLocation = await fakeLocationsRepository.findById(location.id);

    expect(finalListSize).toHaveLength(initialListSize.length - 1);
    expect(findLocation).toBeUndefined();
  });

  it('Should delete the picture when removing location', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

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
    });

    location.picture = 'picture.jpg';
    const locationWithPicture = await fakeLocationsRepository.update(location);

    await removeLocation.execute({
      user_id: user.id,
      location_id: locationWithPicture.id,
    });

    expect(deleteFile).toHaveBeenCalledWith('picture.jpg', 'locations');
  });

  it('Should not allow invalid users to remove a location', async () => {
    await expect(
      removeLocation.execute({
        user_id: 'I do not exist',
        location_id: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow non storyteller users remove a location', async () => {
    const noSTUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
    });

    await expect(
      removeLocation.execute({
        user_id: noSTUser.id,
        location_id: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow remove a non existant location', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      removeLocation.execute({
        user_id: user.id,
        location_id: 'I do not exist',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
