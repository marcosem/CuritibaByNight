import { getCustomRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import User from '@modules/users/infra/typeorm/entities/User';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import UsersRepository from '@modules/users/repositories/UsersRepository';

interface RequestDTO {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: RequestDTO): Promise<Response> {
    const usersRepository = getCustomRepository(UsersRepository);

    // Verify if login is user email or user login
    // eslint-disable-next-line no-useless-escape
    // const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // let usingEmail: boolean;
    // let user: User | null;
    // if (re.test(String(email).toLowerCase())) {
    // Verify is user email already exist
    const user = await usersRepository.findUserByEmail(email);
    if (!user) {
      throw new AppError('Incorrect login validation.', 401);
    }
    // }

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
    await usersRepository.save(user);

    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserService;
