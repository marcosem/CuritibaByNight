import { Request, Response } from 'express';
import GetCharactersInfluencesService from '@modules/characters/services/GetCharactersInfluencesService';
import { container } from 'tsyringe';

export default class CharactersController {
  public async index(req: Request, res: Response): Promise<Response> {
    const characterInfluences = container.resolve(
      GetCharactersInfluencesService,
    );

    const charInfluencesList = await characterInfluences.execute(req.user.id);

    return res.json(charInfluencesList);
  }
}
