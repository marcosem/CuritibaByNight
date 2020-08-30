import nodemailer, { Transporter } from 'nodemailer';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor() {
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

  public async sendMail(to: string, body: string): Promise<void> {
    const massage = await this.client.sendMail({
      from: 'Curitiba By Night <owbn.curitiba@gmail.com>',
      to,
      subject: 'Recuperação de Senha',
      text: body,
    });

    console.log('Message sent: %s', massage.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(massage));
  }
}

export default EtherealMailProvider;
