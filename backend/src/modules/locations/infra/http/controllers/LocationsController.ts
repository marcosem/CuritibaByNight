import { Request, Response } from 'express';
import CreateLocationService from '@modules/locations/services/CreateLocationService';
import GetLocationService from '@modules/locations/services/GetLocationService';
import GetLocationsListService from '@modules/locations/services/GetLocationsListService';
import UpdateLocationService from '@modules/locations/services/UpdateLocationService';
import RemoveLocationService from '@modules/locations/services/RemoveLocationService';

import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

export default class LocationsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const {
      name,
      description,
      address,
      latitude,
      longitude,
      elysium,
      type,
      level,
      mystical_level,
      property,
      clan,
      creature_type,
      sect,
      char_id,
    } = req.body;

    const createLocationService = container.resolve(CreateLocationService);

    const inputData = {
      user_id: req.user.id,
      name,
      description,
      address,
      latitude,
      longitude,
      elysium,
      type,
      level,
      mystical_level,
      property,
      clan,
      creature_type,
      sect,
      char_id,
    };

    const location = await createLocationService.execute(inputData);

    return res.json(classToClass(location));
  }

  public async show(req: Request, res: Response): Promise<Response> {
    const { location_id, char_id } = req.body;

    const getLocationService = container.resolve(GetLocationService);

    const location = await getLocationService.execute({
      user_id: req.user.id,
      char_id,
      location_id,
    });

    return res.json(classToClass(location));
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const { char_id } = req.body;

    const getLocationsListService = container.resolve(GetLocationsListService);

    const locationList = await getLocationsListService.execute({
      user_id: req.user.id,
      char_id,
    });

    const locationListUpdated = locationList.map(location => {
      const newLocation = location;
      return classToClass(newLocation);
    });

    return res.json(locationListUpdated);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const {
      location_id,
      name,
      description,
      address,
      latitude,
      longitude,
      elysium,
      type,
      level,
      mystical_level,
      property,
      clan,
      creature_type,
      sect,
      char_id,
    } = req.body;

    const getLocationService = container.resolve(GetLocationService);

    const oldLocation = await getLocationService.execute({
      user_id: req.user.id,
      location_id,
    });

    const inputData = {
      user_id: req.user.id,
      location_id,
      name: name || oldLocation.name,
      description: description || oldLocation.description,
      address: address || oldLocation.address,
      latitude: latitude || oldLocation.latitude,
      longitude: longitude || oldLocation.longitude,
      elysium,
      type: type || oldLocation.type,
      level: level || oldLocation.level,
      mystical_level:
        mystical_level !== oldLocation.mystical_level
          ? mystical_level
          : oldLocation.mystical_level,
      property: property || oldLocation.property,
      clan: clan !== undefined ? clan : oldLocation.clan,
      creature_type:
        creature_type !== undefined ? creature_type : oldLocation.creature_type,
      sect: sect !== undefined ? sect : oldLocation.sect,
      char_id: char_id !== undefined ? char_id : oldLocation.responsible,
    };

    const updateLocationService = container.resolve(UpdateLocationService);

    const location = await updateLocationService.execute(inputData);

    return res.json(classToClass(location));
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { location_id } = req.body;

    const removeLocationService = container.resolve(RemoveLocationService);

    await removeLocationService.execute({
      user_id: req.user.id,
      location_id,
    });

    return res.status(204).json();
  }
}
