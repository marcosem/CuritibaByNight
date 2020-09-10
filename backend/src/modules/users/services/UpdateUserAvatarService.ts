import { injectable, inject } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IImageClipperProvider from '@shared/container/providers/ImageClipperProvider/models/IImageClipper';

interface IRequestDTO {
  user_id: string;
  avatarPath: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
    @inject('ImageClipperProvider')
    private imageClipperProvider: IImageClipperProvider,
  ) {}

  public async execute({
    user_id,
    avatarPath,
    avatarFilename,
  }: IRequestDTO): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar', 401);
    }

    if (user.avatar) {
      this.storageProvider.deleteFile(user.avatar, 'avatar');
    }

    const croppedFile = await this.imageClipperProvider.cropImage(
      avatarFilename,
      avatarPath,
      1,
      1,
    );

    let newFilename: string;
    if (avatarFilename !== croppedFile) {
      this.storageProvider.deleteFile(avatarFilename, '');
      newFilename = croppedFile;
    } else {
      newFilename = avatarFilename;
    }

    const filename = await this.storageProvider.saveFile(newFilename, 'avatar');

    // user.avatar = avatarFilename;
    user.avatar = filename;
    await this.usersRepository.update(user);

    return user;
  }
}

export default UpdateUserAvatarService;
