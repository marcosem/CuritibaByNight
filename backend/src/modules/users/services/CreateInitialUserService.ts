import { injectable, inject } from 'tsyringe';
import { uuid } from 'uuidv4';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import { resolve } from 'path';
import uploadConfig from '@config/upload';

interface IRequestDTO {
  name: string;
  email: string;
  phone: string;
}

@injectable()
class CreateInitialUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public async execute({ name, email, phone }: IRequestDTO): Promise<User> {
    // Verify is user email already exist
    const userEmailExist = await this.usersRepository.findByEmail(email);
    if (userEmailExist) {
      throw new AppError('Email address already exist.', 409);
    }

    const user = await this.usersRepository.create({
      name,
      email,
      phone,
      storyteller: false,
      secret: uuid(),
    });

    const invitationTemplate = resolve(
      __dirname,
      '..',
      'views',
      'invitation.hbs',
    );

    // getting user first name.
    const userNames = user.name.split(' ');

    const assetsUpload = uploadConfig('assets');
    let baseAssetsURL: string;
    if (assetsUpload.driver === 's3') {
      baseAssetsURL = `https://${assetsUpload.config.s3.bucket}.s3.us-east-2.amazonaws.com`;
    } else {
      baseAssetsURL = `${process.env.APP_API_URL}/images`;
    }

    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[Curitiba By Night] Conheça o nosso site',
      templateData: {
        file: invitationTemplate,
        variables: {
          name: userNames[0],
          link: `${process.env.APP_WEB_URL}/complete/${user.secret}`,
          imgLogo: `${baseAssetsURL}/curitibabynight.png`,
          imgWebsite: `${baseAssetsURL}/images/website.jpg`,
        },
      },
    });

    return user;
  }
}

export default CreateInitialUserService;
