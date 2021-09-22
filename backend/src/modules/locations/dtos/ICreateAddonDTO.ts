export default interface ICreateAddonDTO {
  name: string;
  level: number;
  description: string;
  defense?: number;
  surveillance?: number;
  req_background?: string | null;
  req_merit?: string | null;
  req_influence?: string | null;
  req_other?: string | null;
  req_addon_1?: string | null;
  req_addon_2?: string | null;
  req_addon_3?: string | null;
  ability: string;
  ability_qty: number;
  influence: string;
  influence_qty: number;
  time_qty: number;
  time_type: 'days' | 'weeks' | 'months' | 'years';
}
