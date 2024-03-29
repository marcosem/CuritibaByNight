import InfluenceAction from '@modules/influences/infra/typeorm/entities/InfluenceAction';
import ICreateInfluenceActionDTO from '@modules/influences/dtos/ICreateInfluenceActionDTO';
import IInfluenceActionsRepository from '@modules/influences/repositories/IInfluenceActionsRepository';

import { v4 } from 'uuid';

class FakeInfluenceActionsRepository implements IInfluenceActionsRepository {
  private influenceActions: InfluenceAction[] = [];

  public async create({
    title,
    action_period,
    backgrounds = '',
    influence,
    influence_level = 0,
    influence_effective_level = 0,
    ability = '',
    ability_level = 0,
    endeavor = 'other',
    character_id,
    action_owner_id = undefined,
    storyteller_id = undefined,
    action = '',
    action_force = 0,
    status = 'sent',
    st_reply = '',
    news = '',
    result = 'not evaluated',
  }: ICreateInfluenceActionDTO): Promise<InfluenceAction> {
    const influenceAction = new InfluenceAction();

    Object.assign(influenceAction, {
      id: v4(),
      title,
      action_period,
      backgrounds,
      influence,
      influence_level,
      influence_effective_level,
      ability,
      ability_level,
      endeavor,
      character_id,
      action_owner_id: action_owner_id === undefined ? null : action_owner_id,
      storyteller_id: storyteller_id === undefined ? null : storyteller_id,
      action,
      action_force,
      status,
      st_reply,
      news,
      result,
    });

    this.influenceActions.push(influenceAction);

    return influenceAction;
  }

  public async update(
    influenceAction: InfluenceAction,
  ): Promise<InfluenceAction> {
    this.influenceActions = this.influenceActions.map(oldAction =>
      oldAction.id !== influenceAction.id ? oldAction : influenceAction,
    );

    return influenceAction;
  }

  public async findById(
    action_id: string,
  ): Promise<InfluenceAction | undefined> {
    const actionFound = this.influenceActions.find(
      action => action.id === action_id,
    );

    return actionFound;
  }

  public async listAll(pending_only?: boolean): Promise<InfluenceAction[]> {
    let actionList: InfluenceAction[];

    if (pending_only) {
      actionList = this.influenceActions.filter(
        action => action.status !== 'replied',
      );
    } else {
      actionList = this.influenceActions;
    }

    return actionList;
  }

  public async listAllByPeriod(
    action_period: string,
    pending_only?: boolean,
  ): Promise<InfluenceAction[]> {
    let actionList: InfluenceAction[];

    if (pending_only) {
      actionList = this.influenceActions.filter(
        action =>
          action.action_period === action_period && action.status !== 'replied',
      );
    } else {
      actionList = this.influenceActions.filter(
        action => action.action_period === action_period,
      );
    }

    return actionList;
  }

  public async listAllByCharacter(
    char_id: string,
    action_period?: string,
    pending_only?: boolean,
  ): Promise<InfluenceAction[]> {
    let actionList: InfluenceAction[];

    if (action_period) {
      if (pending_only) {
        actionList = this.influenceActions.filter(
          action =>
            action.character_id === char_id &&
            action.action_period === action_period &&
            action.status !== 'replied',
        );
      } else {
        actionList = this.influenceActions.filter(
          action =>
            action.character_id === char_id &&
            action.action_period === action_period,
        );
      }
    } else if (pending_only) {
      actionList = this.influenceActions.filter(
        action =>
          action.character_id === char_id && action.status !== 'replied',
      );
    } else {
      actionList = this.influenceActions.filter(
        action => action.character_id === char_id,
      );
    }

    return actionList;
  }

  public async delete(action_id: string): Promise<void> {
    const listWithRemovedAction = this.influenceActions.filter(
      action => action.id !== action_id,
    );

    this.influenceActions = listWithRemovedAction;
  }
}

export default FakeInfluenceActionsRepository;
