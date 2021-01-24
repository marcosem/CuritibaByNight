import { Request, Response } from 'express';
import GetRetainerListService from '@modules/characters/services/GetRetainerListService';
import UpdateRetainerXPService from '@modules/characters/services/UpdateRetainerXPService';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

export default class CharacterRetainersController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { character_id } = req.body;
    const situation = req.body.situation ? req.body.situation : 'active';

    const retainersList = container.resolve(GetRetainerListService);

    const charList = await retainersList.execute({
      user_id: req.user.id,
      char_id: character_id,
      situation,
    });

    const charListUpdated = charList.map(char => {
      const newChar = char;
      return classToClass(newChar);
    });

    return res.json(charListUpdated);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { character_id } = req.body;
    const situation = req.body.situation ? req.body.situation : 'active';

    const retainersList = container.resolve(UpdateRetainerXPService);

    await retainersList.execute({
      user_id: req.user.id,
      char_id: character_id,
      situation,
    });

    return res.status(204).json();
  }
}
