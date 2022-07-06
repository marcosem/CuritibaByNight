import { Request, Response } from 'express';
import GetLocationAvailableTraitsService from '@modules/locations/services/GetLocationAvailableTraitsService';

import { container } from 'tsyringe';

export default class LocationAvailableTraitsController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { trait_type } = req.body;

    const getLocationAvailableTraitsService = container.resolve(
      GetLocationAvailableTraitsService,
    );

    const locAvaiTraits = await getLocationAvailableTraitsService.execute({
      user_id: req.user.id,
      trait_type,
    });

    return res.json(locAvaiTraits);
  }
}
