import InfluenceAction from '@modules/influences/infra/typeorm/entities/InfluenceAction';
import ICreateInfluenceActionDTO from '@modules/influences/dtos/ICreateInfluenceActionDTO';
import IInfluenceActionRepository from '@modules/influences/repositories/IInfluenceActionRepository';

import { v4 } from 'uuid';

class FakeInfluenceActionRepository implements IInfluenceActionRepository {
  private influenceActions: InfluenceAction[] = [];

  public async create({
    action_period,
    background = '',
    background_level = -1,
    influence,
    influence_level = 0,
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
    result = 'not evaluated',
  }: ICreateInfluenceActionDTO): Promise<InfluenceAction> {
    const influenceAction = new InfluenceAction();

    Object.assign(influenceAction, {
      id: v4(),
      action_period,
      background: background === '' ? null : background,
      background_level,
      influence,
      influence_level,
      ability: ability === '' ? null : ability,
      ability_level,
      endeavor,
      character_id,
      action_owner_id: action_owner_id === undefined ? null : action_owner_id,
      storyteller_id: storyteller_id === undefined ? null : storyteller_id,
      action,
      action_force,
      status,
      st_reply,
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
    const findAction = this.influenceActions.find(
      action => action.id === action_id,
    );

    return findAction;
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

export default FakeInfluenceActionRepository;
