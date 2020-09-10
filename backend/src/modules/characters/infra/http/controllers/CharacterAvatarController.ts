import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateCharacterAvatarService from '@modules/characters/services/UpdateCharacterAvatarService';
import { classToClass } from 'class-transformer';

export default class CharacterAvatarController {
  public async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const updateCharAvatar = container.resolve(UpdateCharacterAvatarService);

    const char = await updateCharAvatar.execute({
      user_id: req.user.id,
      char_id: id,
      avatarPath: req.file.destination,
      avatarFilename: req.file.filename,
    });

    return res.json(classToClass(char));
  }
}
