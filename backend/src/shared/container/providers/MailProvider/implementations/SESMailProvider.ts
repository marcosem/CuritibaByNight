/* eslint-disable no-param-reassign */
import { injectable, inject } from 'tsyringe';
import nodemailer, { Transporter } from 'nodemailer';
import aws from 'aws-sdk';
import mailConfig from '@config/mail';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import ISendMailDTO from '@shared/container/providers/MailProvider/dtos/ISendMailDTO';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import uploadConfig from '@config/upload';

interface ITamplateVariables {
  [key: string]: string | number;
}

@injectable()
class SESMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    // create Nodemailer SES transporter
    this.client = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01',
        region: 'us-east-2',
      }),
    });
  }

  public async sendMail({
    to,
    from,
    subject,
    templateData,
    attachments,
  }: ISendMailDTO): Promise<void> {
    const { name, email } = mailConfig.defaults.from;

    templateData.variables = this.parseVariables(templateData.variables);

    await this.client.sendMail({
      from: {
        name: from?.name || name,
        address: from?.email || email,
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
      attachments: attachments || [],
    });
  }

  private parseVariables(variables: ITamplateVariables): ITamplateVariables {
    const assetsUpload = uploadConfig('assets');

    Object.keys(variables).forEach(key => {
      if (key.startsWith('img')) {
        variables[
          key
        ] = `https://${assetsUpload.config.s3.bucket}.s3.us-east-2.amazonaws.com/${variables[key]}`;
      }
    });

    return variables;
  }
}

export default SESMailProvider;
