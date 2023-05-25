export default interface ICreateInfluenceActionDTO {
  action_period: string;
  background?: string;
  background_level?: number;
  influence: string;
  influence_level: number;
  ability?: string;
  ability_level?: number;
  endeavor?: string;
  character_id: string;
  action_owner_id?: string;
  storyteller_id?: string;
  action?: string;
  action_force?: number;
  status?: string;
  st_reply?: string;
  result?: string;
}
