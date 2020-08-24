import { getCustomRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import AppError from '@shared/errors/AppError';
import authConfig from '@config/auth';

import UsersRepository from '@modules/users/repositories/UsersRepository';

interface TokenPayload {
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
  const usersRepository = getCustomRepository(UsersRepository);

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub } = decoded as TokenPayload;
    const user = await usersRepository.findOne(sub);
    const isST = user ? user.storyteller : false;

    if (!isST) {
      throw new AppError('User does not have Storyteller permissions.', 401);
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
