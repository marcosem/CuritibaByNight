import InfluenceAction from '@modules/influences/infra/typeorm/entities/InfluenceAction';
import ICreateInfluenceActionDTO from '@modules/influences/dtos/ICreateInfluenceActionDTO';

export default interface IInfluenceActionRepository {
  create(data: ICreateInfluenceActionDTO): Promise<InfluenceAction>;
  update(influenceAction: InfluenceAction): Promise<InfluenceAction>;
  findById(action_id: string): Promise<InfluenceAction | undefined>;
  listAll(pending_only?: boolean): Promise<InfluenceAction[]>;
  listAllByPeriod(
    action_period: string,
    pending_only?: boolean,
  ): Promise<InfluenceAction[]>;
  listAllByCharacter(
    char_id: string,
    action_period?: string,
    pending_only?: boolean,
  ): Promise<InfluenceAction[]>;
  delete(action_id: string): Promise<void>;
}
