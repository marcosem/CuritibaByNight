import { Request, Response } from 'express';
import GetPowersFullListService from '@modules/characters/services/GetPowersFullListService';
import { container } from 'tsyringe';
// import { classToClass } from 'class-transformer';

export default class CharactersController {
  public async index(req: Request, res: Response): Promise<Response> {
    // const { id } = req.params;

    const powersFullList = container.resolve(GetPowersFullListService);

    const charList = await powersFullList.execute(req.user.id);

    return res.json(charList);
  }
}
