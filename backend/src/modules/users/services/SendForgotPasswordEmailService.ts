import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import { resolve } from 'path';

interface IRequestDTO {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('MailProvider')
    private mailProvider: IMailProvider,
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute({ email }: IRequestDTO): Promise<void> {
    // Verify is user email already exist
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError('The user does not exists.', 400);
    }

    const { token } = await this.userTokensRepository.generate(user.id);

    const forgotPasswordTemplate = resolve(
      __dirname,
      '..',
      'views',
      'forgot_password2.hbs',
    );

    const imageTemplatePath = resolve(__dirname, '..', 'views', 'images');

    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[Curitiba By Night] Recuperação de Senha',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `http://localhost:3000/reset_password?token=${token}`,
        },
      },
      attachments: [
        {
          filename: 'curitibabynight.svg',
          path: resolve(imageTemplatePath, 'curitibabynight.svg'),
          contentType: 'image/svg+xml',
          cid: 'curitibabynight.svg',
        },
        {
          filename: 'password.jpg',
          path: resolve(imageTemplatePath, 'password.jpg'),
          contentType: 'image/jpeg',
          cid: 'password.jpg',
        },
      ],
    });
  }
}

export default SendForgotPasswordEmailService;
