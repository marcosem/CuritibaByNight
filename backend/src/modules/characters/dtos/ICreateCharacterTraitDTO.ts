export default interface ICreateCharacterTraitDTO {
  trait: string;
  character_id: string;
  level: number;
  level_temp?: string;
  type: string;
  updated_at?: Date;
}
