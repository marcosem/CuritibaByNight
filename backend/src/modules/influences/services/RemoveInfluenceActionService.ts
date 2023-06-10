import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import IInfluenceActionsRepository from '@modules/influences/repositories/IInfluenceActionsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICharactersRepository from '@modules/characters/repositories/ICharactersRepository';

interface IRequestDTO {
  user_id: string;
  action_id: string;
  char_id?: string;
}

@injectable()
class RemoveInfluenceActionService {
  constructor(
    @inject('InfluenceActionsRepository')
    private influenceActionsRepository: IInfluenceActionsRepository,
    @inject('CharactersRepository')
    private charactersRepository: ICharactersRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    action_id,
    char_id = '',
  }: IRequestDTO): Promise<void> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated user can remove an influence action',
        401,
      );
    } else if (char_id === '' && !user.storyteller) {
      throw new AppError(
        'Only authenticated Storytellers can remove an influence action for any character',
        401,
      );
    }

    const infAction = await this.influenceActionsRepository.findById(action_id);
    if (!infAction) {
      throw new AppError('Influence action not found', 400);
    }

    if (infAction.result !== 'not evaluated' && !user.storyteller) {
      throw new AppError(
        'Only not evaluated influence action can be updated',
        400,
      );
    }

    if (!user.storyteller) {
      const char = await this.charactersRepository.findById(char_id);

      if (!char) {
        throw new AppError('Character not found', 400);
      }

      if (user_id !== char.user_id) {
        throw new AppError(
          'Only characters owners can remove an influence action of their character',
          401,
        );
      }
    }

    await this.influenceActionsRepository.delete(action_id);
  }
}

export default RemoveInfluenceActionService;
