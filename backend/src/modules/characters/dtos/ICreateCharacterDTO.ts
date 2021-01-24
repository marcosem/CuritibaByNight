export default interface ICreateCharacterDTO {
  name: string;
  email?: string;
  user_id?: string;
  experience?: number;
  experience_total?: number;
  clan?: string;
  title?: string;
  coterie?: string;
  situation?: string;
  file: string;
  npc: boolean;
  regnant?: string;
  retainer_level?: number;
}
