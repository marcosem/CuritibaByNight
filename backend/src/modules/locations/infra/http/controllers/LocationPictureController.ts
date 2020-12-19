import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateLocationPictureService from '@modules/locations/services/UpdateLocationPictureService';
import { classToClass } from 'class-transformer';

export default class LocationPictureController {
  public async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const upldateLocationPictureService = container.resolve(
      UpdateLocationPictureService,
    );

    const location = await upldateLocationPictureService.execute({
      user_id: req.user.id,
      location_id: id,
      picturePath: req.file.destination,
      pictureFilename: req.file.filename,
    });

    return res.json(classToClass(location));
  }
}
