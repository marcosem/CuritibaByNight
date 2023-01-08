import { Request, Response } from 'express';
import CreatePowerService from '@modules/characters/services/CreatePowerService';
import GetPowersListService from '@modules/characters/services/GetPowersListService';
import UpdatePowerService from '@modules/characters/services/UpdatePowerService';
import RemovePowerService from '@modules/characters/services/RemovePowerService';
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
    const { id } = req.params;

    const powersList = container.resolve(GetPowersListService);
    const myPowersList = await powersList.execute({
      user_id: req.user.id,
      char_id: id,
    });
    return res.json(myPowersList);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const {
      id,
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

    const updatePowerService = container.resolve(UpdatePowerService);

    const inputData = {
      user_id: req.user.id,
      power_id: id,
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

    const power = await updatePowerService.execute(inputData);

    return res.json(power);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { power_id } = req.body;

    const removePowerService = container.resolve(RemovePowerService);

    await removePowerService.execute({
      user_id: req.user.id,
      power_id,
    });

    return res.status(204).json();
  }
}
