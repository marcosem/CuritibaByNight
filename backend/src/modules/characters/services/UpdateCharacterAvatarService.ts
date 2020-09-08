import { injectable, inject } from 'tsyringe';
import Character from '@modules/characters/infra/typeorm/entities/Character';
import AppError from '@shared/errors/AppError';
import ICharactersRepository from '@modules/characters/repositories/ICharactersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

interface IRequestDTO {
  user_id: string;
  char_id: string;
  avatarFilename: string;
}

@injectable()
class UpdateChracterAvatarService {
  constructor(
    @inject('CharactersRepository')
    private charactersRespository: ICharactersRepository,
    @inject('UsersRepository')
    private usersRespository: IUsersRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    user_id,
    char_id,
    avatarFilename,
  }: IRequestDTO): Promise<Character> {
    const user = await this.usersRespository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar', 401);
    }

    const char = await this.charactersRespository.findById(char_id);

    if (!char) {
      throw new AppError('Character not found', 400);
    }

    if (char.user_id !== user_id) {
      throw new AppError('Only the character owner can change its avatar', 401);
    }

    if (char.avatar) {
      this.storageProvider.deleteFile(char.avatar, 'avatar');
    }

    const filename = await this.storageProvider.saveFile(
      avatarFilename,
      'avatar',
    );

    // user.avatar = avatarFilename;
    char.avatar = filename;
    await this.charactersRespository.update(char);

    return char;
  }
}

export default UpdateChracterAvatarService;
