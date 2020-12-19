import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Location from '@modules/locations/infra/typeorm/entities/Location';
import ILocationsRepository from '@modules/locations/repositories/ILocationsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IImageClipperProvider from '@shared/container/providers/ImageClipperProvider/models/IImageClipper';

interface IRequestDTO {
  user_id: string;
  location_id: string;
  picturePath: string;
  pictureFilename: string;
}

@injectable()
class UpdateLocationPictureService {
  constructor(
    @inject('LocationsRepository')
    private locationsRepository: ILocationsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
    @inject('ImageClipperProvider')
    private imageClipperProvider: IImageClipperProvider,
  ) {}

  public async execute({
    user_id,
    location_id,
    picturePath,
    pictureFilename,
  }: IRequestDTO): Promise<Location> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated Storytellers can change locations picture',
        401,
      );
    } else if (!user.storyteller) {
      throw new AppError(
        'Only authenticated Storytellers can change locations picture',
        401,
      );
    }

    const location = await this.locationsRepository.findById(location_id);

    if (!location) {
      throw new AppError('Location not found', 400);
    }

    if (location.picture) {
      this.storageProvider.deleteFile(location.picture, 'locations');
    }

    const croppedFile = await this.imageClipperProvider.cropImage(
      pictureFilename,
      picturePath,
      200,
      200,
    );

    let newFilename: string;
    if (pictureFilename !== croppedFile) {
      this.storageProvider.deleteFile(pictureFilename, '');
      newFilename = croppedFile;
    } else {
      newFilename = pictureFilename;
    }

    const filename = await this.storageProvider.saveFile(
      newFilename,
      'locations',
    );

    location.picture = filename;
    await this.locationsRepository.update(location);

    return location;
  }
}

export default UpdateLocationPictureService;
