import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import AppError from '../errors/AppError';
import authConfig from '../config/auth';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

// Validate JWT token
export default function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  // Take out Bearer
  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub } = decoded as TokenPayload;

    // Redefinition of express.Request on @types, adding .user
    req.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new AppError('Invalid JWT token', 401);
  }
}
