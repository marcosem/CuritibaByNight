/* eslint-disable camelcase */
export default interface ICharacter {
  id: string;
  name: string;
  clan: string;
  title: string;
  coterie: string;
  avatar_url: string;
  experience: string;
  experience_total: string;
  updated_at: Date;
  character_url: string;
  situation: string;
  npc: boolean;
  regnant?: string;
  regnant_char?: {
    id: string;
    name: string;
  };
  retainer_level: string;
  formatedDate?: string;
  user?: {
    id: string;
    name: string;
  };
}
