import { Request, Response } from 'express';
import GetCharacterTraitsService from '@modules/characters/services/GetCharacterTraitsService';
import { container } from 'tsyringe';

export default class CharacterTraitsController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const charTraitsList = container.resolve(GetCharacterTraitsService);

    const traitsList = await charTraitsList.execute({
      user_id: req.user.id,
      char_id: id,
    });

    return res.json(traitsList);
  }
}
