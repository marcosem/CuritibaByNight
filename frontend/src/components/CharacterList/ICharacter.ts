/* eslint-disable camelcase */
export default interface ICharacter {
  id: string;
  name: string;
  clan: string;
  title: string;
  coterie: string;
  avatar_url: string;
  experience: string;
  updated_at: Date;
  character_url: string;
  situation: string;
  npc: boolean;
  formatedDate?: string;
  user?: {
    id: string;
    name: string;
  };
}
