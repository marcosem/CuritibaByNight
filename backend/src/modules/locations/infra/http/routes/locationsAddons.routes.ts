import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import LocationAddonController from '@modules/locations/infra/http/controllers/LocationAddonController';
import ensureSTAuthenticated from '@modules/users/infra/http/middlewares/ensureSTAuthenticated';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const locationsAddonsRouter = Router();
const locationAddonController = new LocationAddonController();

locationsAddonsRouter.post(
  '/add',
  ensureSTAuthenticated,
  celebrate({
    [Segments.BODY]: {
      addon_name: Joi.string().required(),
      addon_level: Joi.number().min(0).optional(),
      location_id: Joi.string().uuid().required(),
    },
  }),
  locationAddonController.create,
);

locationsAddonsRouter.post(
  '/list',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      char_id: Joi.string().uuid().required(),
      location_id: Joi.string().uuid().required(),
    },
  }),
  locationAddonController.index,
);

locationsAddonsRouter.patch(
  '/update',
  ensureSTAuthenticated,
  celebrate({
    [Segments.BODY]: {
      addon_name: Joi.string().required(),
      addon_level: Joi.number().min(0).optional(),
      location_id: Joi.string().uuid().required(),
      temp_ability: Joi.number().min(0).optional(),
      temp_influence: Joi.number().min(0).optional(),
    },
  }),
  locationAddonController.update,
);

locationsAddonsRouter.delete(
  '/remove',
  ensureSTAuthenticated,
  celebrate({
    [Segments.BODY]: {
      location_id: Joi.string().uuid().required(),
      addon_name: Joi.string().required(),
    },
  }),
  locationAddonController.delete,
);

export default locationsAddonsRouter;
