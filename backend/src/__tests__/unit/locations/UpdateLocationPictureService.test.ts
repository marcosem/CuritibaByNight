import 'reflect-metadata';
import FakeLocationRepository from '@modules/locations/repositories/fakes/FakeLocationRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeImageClipperProvider from '@shared/container/providers/ImageClipperProvider/fakes/FakeImageClipperProvider';
import UpdateLocationPictureService from '@modules/locations/services/UpdateLocationPictureService';
import AppError from '@shared/errors/AppError';

let fakeLocationRepository: FakeLocationRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let fakeImageClipperProvider: FakeImageClipperProvider;
let updateLocationPicture: UpdateLocationPictureService;

describe('UpdateLocationPicture', () => {
  beforeEach(() => {
    fakeLocationRepository = new FakeLocationRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    fakeImageClipperProvider = new FakeImageClipperProvider();

    updateLocationPicture = new UpdateLocationPictureService(
      fakeLocationRepository,
      fakeUsersRepository,
      fakeStorageProvider,
      fakeImageClipperProvider,
    );
  });

  it('Should be able to update the location picute', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const location = await fakeLocationRepository.create({
      name: 'Prefeitura de Curitiba',
      description: 'Prefeitura Municipal de Curitiba',
      latitude: -25.4166496,
      longitude: -49.2713069,
    });

    const locationWithPicture = await updateLocationPicture.execute({
      user_id: user.id,
      location_id: location.id,
      picturePath: '/does not matter',
      pictureFilename: 'picture.jpg',
    });

    expect(locationWithPicture).toHaveProperty('picture', 'picture.jpg');
  });

  it('Should delete old picture before add new', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const location = await fakeLocationRepository.create({
      name: 'Prefeitura de Curitiba',
      description: 'Prefeitura Municipal de Curitiba',
      latitude: -25.4166496,
      longitude: -49.2713069,
    });

    await updateLocationPicture.execute({
      user_id: user.id,
      location_id: location.id,
      picturePath: '/does not matter',
      pictureFilename: 'picture.jpg',
    });

    const locationWithPicture = await updateLocationPicture.execute({
      user_id: user.id,
      location_id: location.id,
      picturePath: '/does not matter',
      pictureFilename: 'new_picture.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('picture.jpg', 'locations');
    expect(locationWithPicture).toHaveProperty('picture', 'new_picture.jpg');
  });

  it('Should not allow invalid users to update location picture', async () => {
    await expect(
      updateLocationPicture.execute({
        user_id: 'I am invalid',
        location_id: 'Does not matter',
        picturePath: '/does not matter',
        pictureFilename: 'doesNotMatter.jpg',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow non storyteller users to update location picture', async () => {
    const noStUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
    });

    await expect(
      updateLocationPicture.execute({
        user_id: noStUser.id,
        location_id: 'Does not matter',
        picturePath: '/does not matter',
        pictureFilename: 'doesNotMatter.jpg',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow to update picture for a non existant location', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      updateLocationPicture.execute({
        user_id: user.id,
        location_id: 'I do not exist',
        picturePath: '/does not matter',
        pictureFilename: 'doesNotMatter.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should use the adjusted picture file when have some adjust', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const location = await fakeLocationRepository.create({
      name: 'Prefeitura de Curitiba',
      description: 'Prefeitura Municipal de Curitiba',
      latitude: -25.4166496,
      longitude: -49.2713069,
    });

    jest
      .spyOn(fakeImageClipperProvider, 'cropImage')
      .mockImplementationOnce(async file => {
        return `different_${file}`;
      });

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const locationWithPicture = await updateLocationPicture.execute({
      user_id: user.id,
      location_id: location.id,
      picturePath: '/does not matter',
      pictureFilename: 'picture.jpg',
    });

    expect(locationWithPicture).toHaveProperty(
      'picture',
      'different_picture.jpg',
    );
    expect(deleteFile).toBeCalledWith('picture.jpg', '');
  });
});
