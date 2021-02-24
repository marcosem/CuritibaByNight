export default interface ICreateCharacterDTO {
  name: string;
  description: string;
  address?: string;
  latitude: number;
  longitude: number;
  elysium?: boolean;
  type?: string;
  level?: number;
  mystical_level?: number;
  property?: string;
  clan?: string;
  creature_type?: string;
  sect?: string;
  responsible?: string;
}
