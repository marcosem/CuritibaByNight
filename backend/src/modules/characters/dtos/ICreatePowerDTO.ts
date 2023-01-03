export default interface ICreatePowerDTO {
  long_name: string;
  short_name: string;
  level?: number;
  type?: string;
  origin?: string;
  requirements?: string;
  description: string;
  system: string;
  cost?: number;
  source?: string;
}
