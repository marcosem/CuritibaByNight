import { Request, Response } from 'express';
import ReviewInfluenceActionService from '@modules/influences/services/ReviewInfluenceActionService';
import ReadInfluenceActionService from '@modules/influences/services/ReadInfluenceActionService';

import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

export default class InfluenceActionsController {
  public async update(req: Request, res: Response): Promise<Response> {
    const { id, st_reply, result, news } = req.body;

    const reviewInfluenceActionService = container.resolve(
      ReviewInfluenceActionService,
    );

    const influenceAction = await reviewInfluenceActionService.execute({
      user_id: req.user.id,
      action_id: id,
      st_reply,
      result,
      news,
    });

    return res.json(classToClass(influenceAction));
  }

  public async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const readInfluenceActionService = container.resolve(
      ReadInfluenceActionService,
    );

    const influenceAction = await readInfluenceActionService.execute({
      user_id: req.user.id,
      action_id: id,
    });

    return res.json(classToClass(influenceAction));
  }
}
