import { getCustomRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import uploadConfig from '@config/upload';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import UsersRepository from '@modules/users/repositories/UsersRepository';

interface RequestDTO {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: RequestDTO): Promise<User> {
    const usersRepository = getCustomRepository(UsersRepository);

    const user = await usersRepository.findOne({
      where: { id: user_id },
    });

    if (!user) {
      throw new AppError('Only authenticated users can change avatar', 401);
    }

    if (user.avatar) {
      // Delete previews avatar
      const userAvatarFilePath = path.join(
        uploadConfig('avatar').directory,
        user.avatar,
      );
      const userAvatarFileExists = fs.existsSync(userAvatarFilePath); // fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFilename;
    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
