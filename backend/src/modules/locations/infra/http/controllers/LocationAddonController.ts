import { Request, Response } from 'express';
import AddAddonToLocationService from '@modules/locations/services/AddAddonToLocationService';
import GetLocationAddonsService from '@modules/locations/services/GetLocationAddonsService';
import RemoveAddonFromLocationService from '@modules/locations/services/RemoveAddonFromLocationService';
import UpdateAddonLocationService from '@modules/locations/services/UpdateAddonLocationService';

import { container } from 'tsyringe';

export default class LocationsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { addon_name, addon_level, location_id } = req.body;

    const addAddonToLocationService = container.resolve(
      AddAddonToLocationService,
    );

    const addonLocation = await addAddonToLocationService.execute({
      user_id: req.user.id,
      addon_name,
      addon_level,
      location_id,
    });

    return res.json(addonLocation);
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const { char_id, location_id } = req.body;

    const getLocationAddonsService = container.resolve(
      GetLocationAddonsService,
    );

    const locationAddons = await getLocationAddonsService.execute({
      user_id: req.user.id,
      char_id,
      location_id,
    });

    return res.json(locationAddons);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const {
      addon_name,
      addon_level,
      location_id,
      temp_ability,
      temp_influnece,
    } = req.body;

    const updateAddonLocationService = container.resolve(
      UpdateAddonLocationService,
    );

    const inputData = {
      user_id: req.user.id,
      addon_name,
      addon_level,
      location_id,
      temp_ability,
      temp_influnece,
    };

    const locAddon = await updateAddonLocationService.execute(inputData);

    return res.json(locAddon);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { location_id, addon_name } = req.body;

    const removeAddonFromLocationService = container.resolve(
      RemoveAddonFromLocationService,
    );

    await removeAddonFromLocationService.execute({
      user_id: req.user.id,
      addon_name,
      location_id,
    });

    return res.status(204).json();
  }
}