import { Request, Response } from 'express';
import GetCharacterTraitsService from '@modules/characters/services/GetCharacterTraitsService';
import UpdateCharacterTraitService from '@modules/characters/services/UpdateCharacterTraitService';
import { container } from 'tsyringe';

export default class CharacterTraitsController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const getCharTraits = container.resolve(GetCharacterTraitsService);

    const traitsList = await getCharTraits.execute({
      user_id: req.user.id,
      char_id: id,
    });

    return res.json(traitsList);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const {
      character_id,
      trait_id,
      trait_name,
      trait_level,
      trait_level_temp,
      trait_type,
    } = req.body;

    const updateCharTrait = container.resolve(UpdateCharacterTraitService);

    const inputData = {
      user_id: req.user.id,
      char_id: character_id,
      trait_id,
      trait_name,
      trait_level,
      trait_level_temp,
      trait_type,
    };

    const trait = await updateCharTrait.execute(inputData);

    return res.json(trait);
  }
}
