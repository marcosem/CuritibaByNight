import { getRepository, Repository, Not } from 'typeorm';
import InfluenceAction from '@modules/influences/infra/typeorm/entities/InfluenceAction';
import ICreateInfluenceActionDTO from '@modules/influences/dtos/ICreateInfluenceActionDTO';
import IInfluenceActionsRepository from '@modules/influences/repositories/IInfluenceActionsRepository';

class InfluenceActionRepository implements IInfluenceActionsRepository {
  private ormRepository: Repository<InfluenceAction>;

  constructor() {
    this.ormRepository = getRepository(InfluenceAction);
  }

  public async create({
    action_period,
    backgrounds = '',
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
    news = '',
    result = 'not evaluated',
  }: ICreateInfluenceActionDTO): Promise<InfluenceAction> {
    const influenceAction = this.ormRepository.create({
      action_period,
      backgrounds,
      influence,
      influence_level,
      ability,
      ability_level,
      endeavor,
      character_id,
      action_owner_id,
      storyteller_id,
      action,
      action_force,
      status,
      st_reply,
      news,
      result,
    });

    await this.ormRepository.save(influenceAction);

    return influenceAction;
  }

  public async update(
    influenceAction: InfluenceAction,
  ): Promise<InfluenceAction> {
    await this.ormRepository.save(influenceAction);

    // Return what is saved with user relationship attached.
    let savedAction = await this.findById(influenceAction.id);

    if (!savedAction) {
      savedAction = influenceAction;
    }

    return savedAction;
  }

  public async findById(
    action_id: string,
  ): Promise<InfluenceAction | undefined> {
    const actionFound = await this.ormRepository.findOne({
      where: { id: action_id },
      relations: ['characterId', 'ownerId', 'storytellerId'],
    });

    // if not found, return undefined
    return actionFound;
  }

  public async listAll(pending_only?: boolean): Promise<InfluenceAction[]> {
    const status = pending_only ? Not('replied') : undefined;
    const where = {
      status,
    };

    const actionList = await this.ormRepository.find({
      where,
      relations: ['characterId', 'ownerId', 'storytellerId'],
      order: { action_period: 'DESC', influence: 'ASC', created_at: 'ASC' },
    });

    return actionList;
  }

  public async listAllByPeriod(
    action_period: string,
    pending_only?: boolean,
  ): Promise<InfluenceAction[]> {
    const status = pending_only ? Not('replied') : undefined;
    const where = {
      action_period,
      status,
    };

    const actionList = await this.ormRepository.find({
      where,
      relations: ['characterId', 'ownerId', 'storytellerId'],
      order: { influence: 'ASC', created_at: 'ASC' },
    });

    return actionList;
  }

  public async listAllByCharacter(
    char_id: string,
    action_period?: string,
    pending_only?: boolean,
  ): Promise<InfluenceAction[]> {
    const status = pending_only ? Not('replied') : undefined;

    const where = {
      character_id: char_id,
      action_period,
      status,
    };

    const actionList = await this.ormRepository.find({
      where,
      relations: ['characterId', 'ownerId', 'storytellerId'],
      order: { influence: 'ASC', created_at: 'ASC' },
    });

    return actionList;
  }

  public async delete(action_id: string): Promise<void> {
    const action = await this.ormRepository.findOne({
      where: { id: action_id },
    });

    if (action) {
      await this.ormRepository.remove(action);
    }
  }
}

export default InfluenceActionRepository;
