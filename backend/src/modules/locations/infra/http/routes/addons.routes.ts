import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import AddonsController from '@modules/locations/infra/http/controllers/AddonsController';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import LocationAvailableTraitsController from '../controllers/LocationAvailableTraitsController';

const addonsRouter = Router();
const addonsController = new AddonsController();
const locationAvailableTraitsController = new LocationAvailableTraitsController();

addonsRouter.post(
  '/list',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      char_id: Joi.string().uuid().optional(),
      location_id: Joi.string().uuid().required(),
    },
  }),
  addonsController.index,
);

addonsRouter.post(
  '/traitslist',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      trait_type: Joi.string().optional(),
    },
  }),
  locationAvailableTraitsController.index,
);

export default addonsRouter;
