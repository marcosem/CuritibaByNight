/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import { injectable, inject } from 'tsyringe';
import nodemailer, { Transporter } from 'nodemailer';
import mailConfig from '@config/mail';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import ISendMailDTO from '@shared/container/providers/MailProvider/dtos/ISendMailDTO';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';

interface ITamplateVariables {
  [key: string]: string | number;
}

@injectable()
class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      this.client = transporter;
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

    let destination;
    if (to.copyMySelf) {
      destination = [
        {
          name: 'Curitiba By Night',
          address: `${process.env.APP_EMAIL}`,
        },
        {
          name: to.name,
          address: to.email,
        },
      ];
    } else {
      destination = {
        name: to.name,
        address: to.email,
      };
    }

    const massage = await this.client.sendMail({
      from: {
        name: from?.name || name,
        address: from?.email || email,
      },
      to: destination,
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
      attachments: attachments || [],
    });

    console.log('Message sent: %s', massage.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(massage));
  }

  private parseVariables(variables: ITamplateVariables): ITamplateVariables {
    Object.keys(variables).forEach(key => {
      if (key.startsWith('img')) {
        variables[key] = `${process.env.APP_API_URL}/images/${variables[key]}`;
      }
    });

    return variables;
  }
}

export default EtherealMailProvider;
