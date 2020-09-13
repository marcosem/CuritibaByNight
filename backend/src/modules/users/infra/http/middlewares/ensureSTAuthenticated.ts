import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import AppError from '@shared/errors/AppError';
import authConfig from '@config/auth';

import { container } from 'tsyringe';
import CreateSTUserService from '@modules/users/services/GetUserService';

// import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
// import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

// Validate JWT token
export default async function ensureSTAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  // Take out Bearer
  const [, token] = authHeader.split(' ');
  // const usersRepository = getCustomRepository(UsersRepository);
  const getUsers = container.resolve(CreateSTUserService);

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub } = decoded as ITokenPayload;
    const user = await getUsers.execute({ user_id: sub });
    const isST = user ? user.storyteller : false;

    if (!isST) {
      throw new AppError('User does not have Storyteller permissions', 401);
    }

    // Redefinition of express.Request on @types, adding .user
    req.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new AppError('Invalid JWT token', 401);
  }
}
