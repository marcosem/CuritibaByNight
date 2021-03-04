import { injectable, inject } from 'tsyringe';
import { sign } from 'jsonwebtoken';
import User from '@modules/users/infra/typeorm/entities/User';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

interface IRequestDTO {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
  refresh_token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: IRequestDTO): Promise<IResponse> {
    // Verify is user email already exist
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Incorrect login validation', 401);
    }

    // Validate password
    // const passwordMatched = await compare(password, user.password);
    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppError('Incorrect login validation', 401);
    }

    const { secret, expiresIn, refreshTokenExpiresIn } = authConfig.jwt;

    // Generate token
    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    const refreshToken = sign({}, secret, {
      subject: user.id,
      expiresIn: refreshTokenExpiresIn,
    });

    // Update lastLogin date
    user.lastLogin_at = new Date();

    await this.usersRepository.update(user);

    return {
      user,
      token,
      refresh_token: refreshToken,
    };
  }
}

export default AuthenticateUserService;
