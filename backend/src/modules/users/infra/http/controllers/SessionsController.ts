import { Request, Response } from 'express';
import { container } from 'tsyringe';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import RefreshTokenService from '@modules/users/services/RefreshTokenService';
import { classToClass } from 'class-transformer';

export default class SessionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const authenticateUser = container.resolve(AuthenticateUserService);

    const { user, token, refresh_token } = await authenticateUser.execute({
      email,
      password,
    });

    user.secret = '';
    return res.json({ user: classToClass(user), token, refresh_token });
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { token, refresh_token } = req.body;

    const refreshTokenService = container.resolve(RefreshTokenService);

    const resultRefreshToken = await refreshTokenService.execute({
      token,
      refresh_token,
    });

    return res.json(resultRefreshToken);
  }
}
