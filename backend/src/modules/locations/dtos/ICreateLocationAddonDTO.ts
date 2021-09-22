export default interface ICreateLocationAddonDTO {
  location_id: string;
  addon_name: string;
  addon_level: number;
  addon_id_current: string | null;
  addon_id_next: string | null;
  temp_ability: number;
  temp_influence: number;
}
