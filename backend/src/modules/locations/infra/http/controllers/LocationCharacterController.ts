import { Request, Response } from 'express';
import AddCharacterToLocationService from '@modules/locations/services/AddCharacterToLocationService';
import GetCharacterLocationService from '@modules/locations/services/GetCharacterLocationService';
import RemoveCharacterFromLocationService from '@modules/locations/services/RemoveCharacterFromLocationService';

import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

export default class LocationsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { char_id, location_id } = req.body;

    const addCharacterToLocationService = container.resolve(
      AddCharacterToLocationService,
    );

    const inputData = {
      user_id: req.user.id,
      char_id,
      location_id,
    };

    const locChar = await addCharacterToLocationService.execute(inputData);

    return res.json(classToClass(locChar));
  }

  public async show(req: Request, res: Response): Promise<Response> {
    const { location_id, char_id } = req.body;

    const getCharacterLocationService = container.resolve(
      GetCharacterLocationService,
    );

    const locChar = await getCharacterLocationService.execute({
      user_id: req.user.id,
      char_id,
      location_id,
    });

    return res.json(classToClass(locChar));
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { location_id, char_id } = req.body;

    const removeCharacterFromLocationService = container.resolve(
      RemoveCharacterFromLocationService,
    );

    await removeCharacterFromLocationService.execute({
      user_id: req.user.id,
      char_id,
      location_id,
    });

    return res.status(204).json();
  }
}
