import { injectable, inject } from 'tsyringe';
import Character from '@modules/characters/infra/typeorm/entities/Character';
import AppError from '@shared/errors/AppError';
import ICharactersRepository from '@modules/characters/repositories/ICharactersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IImageClipperProvider from '@shared/container/providers/ImageClipperProvider/models/IImageClipper';

interface IRequestDTO {
  user_id: string;
  char_id: string;
  avatarPath: string;
  avatarFilename: string;
}

@injectable()
class UpdateChracterAvatarService {
  constructor(
    @inject('CharactersRepository')
    private charactersRepository: ICharactersRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
    @inject('ImageClipperProvider')
    private imageClipperProvider: IImageClipperProvider,
  ) {}

  public async execute({
    user_id,
    char_id,
    avatarPath,
    avatarFilename,
  }: IRequestDTO): Promise<Character> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar', 401);
    }

    const char = await this.charactersRepository.findById(char_id);

    if (!char) {
      throw new AppError('Character not found', 400);
    }

    if (char.user_id !== user_id) {
      throw new AppError('Only the character owner can change its avatar', 401);
    }

    if (char.avatar) {
      this.storageProvider.deleteFile(char.avatar, 'avatar');
    }

    const croppedFile = await this.imageClipperProvider.cropImage(
      avatarFilename,
      avatarPath,
      192,
      255,
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
    char.avatar = filename;
    await this.charactersRepository.update(char);

    return char;
  }
}

export default UpdateChracterAvatarService;
