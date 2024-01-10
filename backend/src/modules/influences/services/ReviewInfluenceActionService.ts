import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import InfluenceAction from '@modules/influences/infra/typeorm/entities/InfluenceAction';
import IInfluenceActionsRepository from '@modules/influences/repositories/IInfluenceActionsRepository';
import ICharactersRepository from '@modules/characters/repositories/ICharactersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import { resolve } from 'path';

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
    @inject('CharactersRepository')
    private charactersRepository: ICharactersRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('MailProvider')
    private mailProvider: IMailProvider,
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

    const char = await this.charactersRepository.findById(
      infAction.character_id,
    );
    let player;
    if (char && char.user_id) {
      player = await this.usersRepository.findById(char.user_id);

      if (player) {
        const actionReviewTemplate = resolve(
          __dirname,
          '..',
          'views',
          'action_review.hbs',
        );

        // getting user first name.
        const userNames = player.name.split(' ');
        await this.mailProvider.sendMail({
          to: {
            name: player.name,
            email: player.email,
          },
          subject: `Resposta: [Ação de Influência] - ${char.name} - ${infAction.action_period}`,
          templateData: {
            file: actionReviewTemplate,
            variables: {
              name: userNames[0],
              char_name: char.name,
              action_title: infAction.title,
              link: `${process.env.APP_WEB_URL}`,
              imgLogo: 'curitibabynight.png',
              imgManipulation: 'manipulation.jpg',
            },
          },
        });
      }
    }

    return influenceAction;
  }
}

export default ReviewInfluenceActionService;
