import { Request, Response } from 'express';
import CreatePowerService from '@modules/characters/services/CreatePowerService';
import GetPowersFullListService from '@modules/characters/services/GetPowersFullListService';
import { container } from 'tsyringe';
// import { classToClass } from 'class-transformer';

export default class CharactersController {
  public async create(req: Request, res: Response): Promise<Response> {
    const {
      long_name,
      short_name,
      level,
      type,
      origin,
      requirements,
      description,
      system,
      cost,
      source,
    } = req.body;

    const createPowerService = container.resolve(CreatePowerService);

    const inputData = {
      user_id: req.user.id,
      long_name,
      short_name,
      level,
      type,
      origin,
      requirements,
      description,
      system,
      cost,
      source,
    };

    const power = await createPowerService.execute(inputData);

    return res.json(power);
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const powersFullList = container.resolve(GetPowersFullListService);

    const charList = await powersFullList.execute(req.user.id);

    return res.json(charList);
  }
}
