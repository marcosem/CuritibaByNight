export default interface ICreateCharacterDTO {
  name: string;
  description: string;
  address?: string;
  latitude: number;
  longitude: number;
  elysium?: boolean;
  type?: string;
  level?: number;
  property?: string;
  clan?: string;
  responsible?: string;
}
