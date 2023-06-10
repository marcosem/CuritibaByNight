import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import InfluenceAction from '@modules/influences/infra/typeorm/entities/InfluenceAction';
import IInfluenceActionsRepository from '@modules/influences/repositories/IInfluenceActionsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICharactersRepository from '@modules/characters/repositories/ICharactersRepository';

interface IRequestDTO {
  user_id: string;
  char_id?: string;
  action_period?: string;
  pending_only?: boolean;
}

@injectable()
class GetInfluenceActionsListService {
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
    char_id = 'all',
    action_period = undefined,
    pending_only = false,
  }: IRequestDTO): Promise<InfluenceAction[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated user can list influence actions',
        401,
      );
    } else if (char_id === 'all' && !user.storyteller) {
      throw new AppError(
        'Only authenticated Storytellers can list influence actions for all characters',
        401,
      );
    }

    let actionList: InfluenceAction[];
    if (char_id !== 'all') {
      const char = await this.charactersRepository.findById(char_id);

      if (!char) {
        throw new AppError('Character not found', 400);
      }

      if (user_id !== char.user_id) {
        throw new AppError(
          'Only characters owners can list influence actions of their character',
          401,
        );
      }

      actionList = await this.influenceActionsRepository.listAllByCharacter(
        char_id,
        action_period,
        pending_only,
      );
    } else if (action_period) {
      actionList = await this.influenceActionsRepository.listAllByPeriod(
        action_period,
        pending_only,
      );
    } else {
      actionList = await this.influenceActionsRepository.listAll(pending_only);
    }

    return actionList;
  }
}

export default GetInfluenceActionsListService;
