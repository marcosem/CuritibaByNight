import { Request, Response } from 'express';
import GetAvailableAddonsListService from '@modules/locations/services/GetAvailableAddonsListService';

import { container } from 'tsyringe';

export default class AddonsContoller {
  public async index(req: Request, res: Response): Promise<Response> {
    const { location_id, char_id } = req.body;

    const getAvailableAddonsListService = container.resolve(
      GetAvailableAddonsListService,
    );

    const addonsList = await getAvailableAddonsListService.execute({
      user_id: req.user.id,
      char_id,
      location_id,
    });

    return res.json(addonsList);
  }
}
