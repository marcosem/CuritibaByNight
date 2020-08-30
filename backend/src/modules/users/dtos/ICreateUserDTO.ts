export default interface ICreateUserDTO {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  storyteller?: boolean;
  secret?: string;
}
