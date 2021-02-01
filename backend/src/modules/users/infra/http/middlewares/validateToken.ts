import { verify } from 'jsonwebtoken';
import { container } from 'tsyringe';
import GetUserService from '@modules/users/services/GetUserService';
import authConfig from '@config/auth';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

interface IResult {
  user_id: string;
  st: boolean;
  valid: boolean;
}

export default async function validateToken(token: string): Promise<IResult> {
  const getUsers = container.resolve(GetUserService);

  try {
    const decoded = verify(token, authConfig.jwt.secret);
    const { sub } = decoded as ITokenPayload;
    const user = await getUsers.execute({ user_id: sub });
    const isST = user ? user.storyteller : false;

    return {
      user_id: sub,
      st: isST,
      valid: true,
    };
  } catch {
    return {
      user_id: '',
      st: false,
      valid: false,
    };
  }
}
