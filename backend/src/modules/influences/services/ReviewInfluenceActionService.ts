import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import InfluenceAction from '@modules/influences/infra/typeorm/entities/InfluenceAction';
import IInfluenceActionsRepository from '@modules/influences/repositories/IInfluenceActionsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequestDTO {
  user_id: string;
  action_id: string;
  st_reply?: string;
  result: string;
  news?: string;
}

@injectable()
class ReviewInfluenceActionService {
  constructor(
    @inject('InfluenceActionsRepository')
    private influenceActionsRepository: IInfluenceActionsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    action_id,
    st_reply = '',
    result,
    news = '',
  }: IRequestDTO): Promise<InfluenceAction> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated Storytellers can review an influence action',
        401,
      );
    } else if (!user.storyteller) {
      throw new AppError(
        'Only authenticated Storytellers can review an influence action',
        401,
      );
    }

    const infAction = await this.influenceActionsRepository.findById(action_id);
    if (!infAction) {
      throw new AppError('Influence action not found', 400);
    }

    infAction.storyteller_id = user.id;
    infAction.storytellerId = undefined;
    infAction.st_reply = st_reply;
    infAction.result = result;
    infAction.news = news;
    infAction.status = 'replied';

    const influenceAction = await this.influenceActionsRepository.update(
      infAction,
    );

    return influenceAction;
  }
}

export default ReviewInfluenceActionService;
