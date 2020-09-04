import { injectable, inject } from 'tsyringe';
// import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICharactersRepository from '@modules/characters/repositories/ICharactersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import AppError from '@shared/errors/AppError';

interface IRequestDTO {
  user_id: string;
  character_id: string;
}

@injectable()
class RemoveUserService {
  constructor(
    @inject('CharactersRepository')
    private charactersRepository: ICharactersRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ user_id, character_id }: IRequestDTO): Promise<void> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated Storytellers can remove another users',
        401,
      );
    } else if (!user.storyteller) {
      throw new AppError(
        'Only authenticated Storytellers can remove another users',
        401,
      );
    }

    const char = await this.charactersRepository.findById(character_id);

    if (!char) {
      throw new AppError('Character not found', 400);
    }

    if (char.file) {
      this.storageProvider.deleteFile(char.file, 'sheet');
    }

    await this.charactersRepository.delete(char.id);
  }
}

export default RemoveUserService;
