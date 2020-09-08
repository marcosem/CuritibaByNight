export default interface ICreateCharacterDTO {
  name: string;
  email?: string;
  user_id: string;
  experience?: number;
  clan?: string;
  file: string;
}
