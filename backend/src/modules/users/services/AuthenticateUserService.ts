import { injectable, inject } from 'tsyringe';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import User from '@modules/users/infra/typeorm/entities/User';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import IUserRepository from '@modules/users/repositories/IUsersRepository';

interface IRequestDTO {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,
  ) {}

  public async execute({ email, password }: IRequestDTO): Promise<IResponse> {
    // Verify is user email already exist
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Incorrect login validation.', 401);
    }

    // Validate password
    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError('Incorrect login validation.', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    // Generate token
    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    // Update lastLogin date
    user.lastLogin_at = new Date();

    await this.usersRepository.update(user);

    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserService;
