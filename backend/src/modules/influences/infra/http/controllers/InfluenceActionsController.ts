import { Request, Response } from 'express';
import CreateInfluenceActionService from '@modules/influences/services/CreateInfluenceActionService';
import UpdateInfluenceActionService from '@modules/influences/services/UpdateInfluenceActionService';
import InfluenceAction from '@modules/influences/infra/typeorm/entities/InfluenceAction';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

export default class InfluenceActionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const {
      title,
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
      title,
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

  public async update(req: Request, res: Response): Promise<Response> {
    const {
      title,
      id,
      action_period,
      backgrounds,
      influence,
      influence_level,
      ability,
      ability_level,
      endeavor,
      character_id,
      action_owner_id,
      // storyteller_id,
      action,
      // status,
      // st_reply,
      // news,
      // result,
    } = req.body;

    let influenceAction: InfluenceAction;

    // Evaluation
    /* if (storyteller_id) {
      influenceAction = undefined;
    } else { */
    const updateInfluenceActionService = container.resolve(
      UpdateInfluenceActionService,
    );

    influenceAction = await updateInfluenceActionService.execute({
      user_id: req.user.id,
      action_id: id,
      title,
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
    // }

    return res.json(classToClass(influenceAction));
  }
}
