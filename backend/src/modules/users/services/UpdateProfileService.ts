import { injectable, inject } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

interface IRequestDTO {
  user_id: string;
  profile_id?: string;
  name: string;
  email: string;
  phone?: string;
  old_password?: string;
  password?: string;
  storyteller?: boolean;
  active?: boolean;
  lgpd_acceptance?: boolean;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    profile_id,
    name,
    email,
    phone,
    old_password,
    password,
    storyteller,
    active,
    lgpd_acceptance,
  }: IRequestDTO): Promise<User> {
    const user = await this.usersRepository.findById(user_id);
    const profileID = profile_id || user_id;

    if (!user) {
      throw new AppError(
        'Only authenticated users can update the profile',
        401,
      );
    } else if (!user.storyteller && user_id !== profileID) {
      throw new AppError(
        'Only authenticated Storytellers can update other players profile',
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

    const emailExist = await this.usersRepository.findByEmail(email);

    if (emailExist && emailExist.id !== profile.id) {
      throw new AppError('E-mail already in use', 400);
    }

    profile.name = name;
    profile.email = email;
    profile.phone = phone || profile.phone;
    profile.active = active === undefined ? profile.active : active;

    if (
      !user.storyteller &&
      storyteller !== undefined &&
      profile.storyteller !== storyteller
    ) {
      throw new AppError(
        'Only authenticated Storytellers can update storyteller permissions',
        401,
      );
    } else {
      profile.storyteller =
        storyteller === undefined ? profile.storyteller : storyteller;
    }

    if (password) {
      if (!old_password) {
        throw new AppError(
          'You should enter the old password to set a new password',
          401,
        );
      }

      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        profile.password,
      );

      if (!checkOldPassword) {
        throw new AppError('Old password does not match', 401);
      }

      profile.password = await this.hashProvider.generateHash(password);
    }

    if (lgpd_acceptance) {
      if (profileID !== user_id) {
        throw new AppError(
          'Only the user account owner can provide LGPD acceptance',
          401,
        );
      }

      profile.lgpd_acceptance_date = new Date();
    } else if (lgpd_acceptance === false) {
      profile.lgpd_acceptance_date = null;
    }

    await this.usersRepository.update(profile);

    return profile;
  }
}

export default UpdateProfileService;
