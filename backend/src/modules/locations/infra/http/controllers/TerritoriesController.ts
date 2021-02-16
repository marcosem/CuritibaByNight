import { Request, Response } from 'express';
import AddTerritoryService from '@modules/locations/services/AddTerritoryService';
import GetTerritoryService from '@modules/locations/services/GetTerritoryService';
import GetTerritoriesListService from '@modules/locations/services/GetTerritoriesListService';
import UpdateTerritoryService from '@modules/locations/services/UpdateTerritoryService';
import RemoveTerritoryService from '@modules/locations/services/RemoveTerritoryService';

import { container } from 'tsyringe';

export default class LocationsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { name, population, sect } = req.body;

    const addTerritoryService = container.resolve(AddTerritoryService);

    const inputData = {
      user_id: req.user.id,
      name,
      population,
      sect,
    };

    const territory = await addTerritoryService.execute(inputData);

    return res.json(territory);
  }

  public async show(req: Request, res: Response): Promise<Response> {
    const { territory_id, name } = req.body;

    const getTerritoryService = container.resolve(GetTerritoryService);

    const territory = await getTerritoryService.execute({
      user_id: req.user.id,
      territory_id,
      name,
    });

    return res.json(territory);
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const getTerritoriesListService = container.resolve(
      GetTerritoriesListService,
    );

    const territoriesList = await getTerritoriesListService.execute({
      user_id: req.user.id,
    });

    return res.json(territoriesList);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { territory_id, name, population, sect } = req.body;

    const updateTerritoryService = container.resolve(UpdateTerritoryService);

    const territory = await updateTerritoryService.execute({
      user_id: req.user.id,
      territory_id,
      name,
      population,
      sect,
    });

    return res.json(territory);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { territory_id } = req.body;

    const removeTerritorySertice = container.resolve(RemoveTerritoryService);

    await removeTerritorySertice.execute({
      user_id: req.user.id,
      territory_id,
    });

    return res.status(204).json();
  }
}
