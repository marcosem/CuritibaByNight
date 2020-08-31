import IParseMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';

interface IMailContact {
  name: string;
  email: string;
}

interface IMailAttachment {
  filename: string;
  path?: string;
  content?: Buffer;
  contentType?: string;
  cid?: string;
}

export default interface ISendMailDTO {
  to: IMailContact;
  from?: IMailContact;
  subject: string;
  templateData: IParseMailTemplateProvider;
  attachments?: IMailAttachment[];
}
