export default interface ICreateCharacterDTO {
  name: string;
  email?: string;
  user_id?: string;
  experience?: number;
  clan?: string;
  situation?: string;
  file: string;
  npc: boolean;
}
