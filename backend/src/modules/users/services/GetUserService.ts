import { injectable, inject } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequestDTO {
  user_id: string;
  profile_id?: string;
}

@injectable()
class GetUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id, profile_id }: IRequestDTO): Promise<User> {
    const user = await this.usersRepository.findById(user_id);
    const profileID = profile_id || user_id;

    if (!user) {
      throw new AppError('Only authenticated users can see the profile', 401);
    } else if (!user.storyteller && user_id !== profileID) {
      throw new AppError(
        'Only authenticated Storytellers can see other players profile',
        401,
      );
    }

    let profile: User | undefined;
    if (profileID === user_id) {
      profile = user;
    } else {
      profile = await this.usersRepository.findById(profileID);

      if (!profile) {
        throw new AppError('User not found', 400);
      }
    }

    return profile;
  }
}

export default GetUserService;
