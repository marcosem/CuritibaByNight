import 'reflect-metadata';
import RefreshTokenService from '@modules/users/services/RefreshTokenService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';

let fakeUsersRepository: FakeUsersRepository;
let refreshToken: RefreshTokenService;
let userToken: string;
let userRefreshToken: string;

describe('RefreshToken', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository();
    refreshToken = new RefreshTokenService(fakeUsersRepository);

    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
      storyteller: true,
    });

    const { secret, expiresIn, refreshTokenExpiresIn } = authConfig.jwt;
    userToken = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    userRefreshToken = sign({}, secret, {
      subject: user.id,
      expiresIn: refreshTokenExpiresIn,
    });
  });

  it('Should be to able to refresh a token', async () => {
    const response = await refreshToken.execute({
      token: userToken,
      refresh_token: userRefreshToken,
    });

    expect(response).toHaveProperty('token');
    expect(response).toHaveProperty('refresh_token');
  });

  it('Should not allow to refreh invalid tokens', async () => {
    const { token } = await refreshToken.execute({
      token: 'I am invalid',
      refresh_token: userRefreshToken,
    });

    expect(token).toBe('I am invalid');
  });

  it('Should not allow to refresh token from a different user', async () => {
    const newUser = await fakeUsersRepository.create({
      name: 'New User',
      email: 'newuser@user.com',
      password: '123456',
      phone: '12-12345-1234',
      storyteller: false,
    });

    const { secret, expiresIn } = authConfig.jwt;
    const difUserToken = sign({}, secret, {
      subject: newUser.id,
      expiresIn,
    });

    const { token } = await refreshToken.execute({
      token: difUserToken,
      refresh_token: userRefreshToken,
    });

    expect(token).toBe(difUserToken);
  });

  it('Should not allow to refresh token from a invalid user', async () => {
    const user = await fakeUsersRepository.findByEmail('user@user.com');

    if (user) await fakeUsersRepository.delete(user.id);

    const { token } = await refreshToken.execute({
      token: userToken,
      refresh_token: userRefreshToken,
    });

    expect(token).toBe(userToken);
  });
});
