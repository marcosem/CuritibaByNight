import { injectable, inject } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequestDTO {
  user_id: string;
  profile_id?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id, profile_id }: IRequestDTO): Promise<void> {
    const user = await this.usersRepository.findById(user_id);
    const profileID = profile_id || user_id;

    if (!user) {
      throw new AppError('Only authenticated users can remove an account', 401);
    } else if (!user.storyteller && user_id !== profileID) {
      throw new AppError(
        'Only authenticated Storytellers can remove another users',
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

    await this.usersRepository.delete(profileID);
  }
}

export default UpdateProfileService;
