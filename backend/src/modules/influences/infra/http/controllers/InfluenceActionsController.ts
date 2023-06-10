import { Request, Response } from 'express';
import CreateInfluenceActionService from '@modules/influences/services/CreateInfluenceActionService';
import GetInfluenceActionService from '@modules/influences/services/GetInfluenceActionService';
import UpdateInfluenceActionService from '@modules/influences/services/UpdateInfluenceActionService';
import GetInfluenceActionsListService from '@modules/influences/services/GetInfluenceActionsListService';
import RemoveInfluenceActionService from '@modules/influences/services/RemoveInfluenceActionService';
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

  public async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const getInfluenceActionService = container.resolve(
      GetInfluenceActionService,
    );

    const influenceAction = await getInfluenceActionService.execute({
      user_id: req.user.id,
      action_id: id,
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
      action,
    } = req.body;

    const updateInfluenceActionService = container.resolve(
      UpdateInfluenceActionService,
    );

    const influenceAction = await updateInfluenceActionService.execute({
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

    return res.json(classToClass(influenceAction));
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const { char_id, action_period, pending_only } = req.body;

    const getInfluenceActionsListService = container.resolve(
      GetInfluenceActionsListService,
    );

    const inputData = {
      user_id: req.user.id,
      char_id,
      action_period,
      pending_only,
    };

    const actionList = await getInfluenceActionsListService.execute(inputData);

    const actionListUpdated = actionList.map(action => {
      const newAction = action;
      return classToClass(newAction);
    });

    return res.json(actionListUpdated);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { id, character_id } = req.body;

    const removeInfluenceActionService = container.resolve(
      RemoveInfluenceActionService,
    );

    const inputData = {
      user_id: req.user.id,
      action_id: id,
      char_id: character_id,
    };

    await removeInfluenceActionService.execute(inputData);

    return res.status(204).json();
  }
}
