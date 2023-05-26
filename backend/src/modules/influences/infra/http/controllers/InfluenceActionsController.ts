import { Request, Response } from 'express';
import CreateInfluenceActionService from '@modules/influences/services/CreateInfluenceActionService';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

export default class InfluenceActionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const {
      action_period,
      backgrounds,
      influence,
      influence_level,
      ability,
      ability_level,
      endeavor,
      character_id,
      action_owner_id,
      action,
    } = req.body;

    const createInfluenceActionService = container.resolve(
      CreateInfluenceActionService,
    );

    const influenceAction = await createInfluenceActionService.execute({
      user_id: req.user.id,
      action_period,
      backgrounds,
      influence,
      influence_level,
      ability,
      ability_level,
      endeavor,
      character_id,
      action_owner_id,
      action,
    });

    return res.json(classToClass(influenceAction));
  }
}
