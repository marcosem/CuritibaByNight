export default interface ICreateCharacterDTO {
  name: string;
  email?: string;
  user_id?: string;
  experience?: number;
  clan?: string;
  title?: string;
  coterie?: string;
  situation?: string;
  file: string;
  npc: boolean;
}
