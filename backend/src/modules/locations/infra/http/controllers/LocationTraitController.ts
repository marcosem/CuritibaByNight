import { Request, Response } from 'express';
import UpdateTraitLocationService from '@modules/locations/services/UpdateTraitLocationService';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

export default class LocationAddonController {
  public async update(req: Request, res: Response): Promise<Response> {
    const { trait_id, location_id, level } = req.body;

    const updateTraitLocationService = container.resolve(
      UpdateTraitLocationService,
    );

    const traitLocation = await updateTraitLocationService.execute({
      user_id: req.user.id,
      trait_id,
      location_id,
      level,
    });

    return res.json(classToClass(traitLocation));
  }
}
