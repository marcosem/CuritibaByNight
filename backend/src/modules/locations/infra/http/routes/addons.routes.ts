import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import AddonsController from '@modules/locations/infra/http/controllers/AddonsController';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const addonsRouter = Router();
const addonsController = new AddonsController();

addonsRouter.get(
  '/list',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      char_id: Joi.string().uuid().required(),
      location_id: Joi.string().uuid().required(),
    },
  }),
  addonsController.index,
);

export default addonsRouter;
