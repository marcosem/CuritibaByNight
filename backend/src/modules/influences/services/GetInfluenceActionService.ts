import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import InfluenceAction from '@modules/influences/infra/typeorm/entities/InfluenceAction';
import IInfluenceActionsRepository from '@modules/influences/repositories/IInfluenceActionsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICharactersRepository from '@modules/characters/repositories/ICharactersRepository';

interface IRequestDTO {
  user_id: string;
  action_id: string;
}

@injectable()
class GetInfluenceActionService {
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
  }: IRequestDTO): Promise<InfluenceAction> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated user can get an influence action',
        401,
      );
    }

    const infAction = await this.influenceActionsRepository.findById(action_id);
    if (!infAction) {
      throw new AppError('Influence action not found', 400);
    }

    if (!user.storyteller) {
      const char = await this.charactersRepository.findById(
        infAction.character_id,
      );

      if (!char) {
        throw new AppError('Character not found', 400);
      }

      if (user_id !== char.user_id) {
        throw new AppError(
          'Only characters owners can get an influence action of their character',
          401,
        );
      }
    }

    return infAction;
  }
}

export default GetInfluenceActionService;
