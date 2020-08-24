export default interface ICreateUserDTO {
  name: string;
  email: string;
  email_ic?: string;
  phone?: string;
  password?: string;
  storyteller?: boolean;
  secret?: string;
}

/*
interface IRequestDTO {
  name: string;
  email: string;
  email_ic: string;
  phone: string;
}

interface IRequestDTO {
  name: string;
  email: string;
  email_ic: string;
  phone: string;
  password: string;
  secret: string;
}
*/
