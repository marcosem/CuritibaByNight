import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserToken from '@modules/users/infra/typeorm/entities/UserToken';
import { v4 } from 'uuid';

class FakeUserTokensRepository implements IUserTokensRepository {
  private userTokens: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    // Remove old tokens from this user first
    const newList = this.userTokens.filter(
      usrToken => usrToken.user_id !== user_id,
    );

    this.userTokens = newList;

    const userToken = new UserToken();

    Object.assign(userToken, {
      id: v4(),
      token: v4(),
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.userTokens.push(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const findUserToken = this.userTokens.find(
      userToken => userToken.token === token,
    );

    return findUserToken;
  }

  public async delete(token: string): Promise<void> {
    const listWithRemovedTokens = this.userTokens.filter(
      userToken => userToken.token !== token,
    );
    this.userTokens = listWithRemovedTokens;
  }
}

export default FakeUserTokensRepository;
