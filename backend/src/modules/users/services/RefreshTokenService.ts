import { injectable, inject } from 'tsyringe';
import { sign, verify } from 'jsonwebtoken';
import authConfig from '@config/auth';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequestDTO {
  token: string;
  refresh_token: string;
}

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

interface IResponse {
  token: string;
  refresh_token: string;
}

@injectable()
class RefreshTokenService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    token,
    refresh_token,
  }: IRequestDTO): Promise<IResponse> {
    let refreshTokenSub: string;
    let tokenSub: string;
    try {
      // Is the refresh token still valid?
      const decodedRefreshToken = verify(
        refresh_token,
        authConfig.jwt.secret,
      ) as ITokenPayload;
      refreshTokenSub = decodedRefreshToken.sub;

      // get data from token as well
      const decodedToken = verify(token, authConfig.jwt.secret, {
        ignoreExpiration: true,
      }) as ITokenPayload;
      tokenSub = decodedToken.sub;
    } catch {
      return {
        token,
        refresh_token,
      };
    }

    // Are both token from sabe user?
    if (tokenSub !== refreshTokenSub) {
      return {
        token,
        refresh_token,
      };
    }

    // Does the user exist?
    const user = await this.usersRepository.findById(tokenSub);
    if (!user) {
      return {
        token,
        refresh_token,
      };
    }

    // renew the token
    const { secret, expiresIn, refreshTokenExpiresIn } = authConfig.jwt;

    // Generate token
    const newToken = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    const newRefreshToken = sign({}, secret, {
      subject: user.id,
      expiresIn: refreshTokenExpiresIn,
    });

    // Update lastLogin date
    user.lastLogin_at = new Date();

    await this.usersRepository.update(user);

    return {
      token: newToken,
      refresh_token: newRefreshToken,
    };
  }
}

export default RefreshTokenService;
