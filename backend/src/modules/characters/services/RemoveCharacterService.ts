import { injectable, inject } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICharactersRepository from '@modules/characters/repositories/ICharactersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import ISaveRouteResultProvider from '@shared/container/providers/SaveRouteResultProvider/models/ISaveRouteResultProvider';
import AppError from '@shared/errors/AppError';

interface IRequestDTO {
  user_id: string;
  character_id: string;
}

@injectable()
class RemoveCharacterService {
  constructor(
    @inject('CharactersRepository')
    private charactersRepository: ICharactersRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
    @inject('SaveRouteResultProvider')
    private saveRouteResult: ISaveRouteResultProvider,
  ) {}

  public async execute({ user_id, character_id }: IRequestDTO): Promise<void> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated Storytellers can remove characters',
        401,
      );
    } else if (!user.storyteller) {
      throw new AppError(
        'Only authenticated Storytellers can remove characters',
        401,
      );
    }

    const char = await this.charactersRepository.findById(character_id);

    if (!char) {
      throw new AppError('Character not found', 400);
    }

    // Remove saved route results when remove a character
    this.saveRouteResult.remove('CharactersInfluences');

    this.storageProvider.deleteFile(char.file, 'sheet');

    if (char.avatar) {
      this.storageProvider.deleteFile(char.avatar, 'avatar');
    }

    await this.charactersRepository.delete(char.id);
  }
}

export default RemoveCharacterService;
