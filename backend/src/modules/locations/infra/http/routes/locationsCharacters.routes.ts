import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import LocationCharacterController from '@modules/locations/infra/http/controllers/LocationCharacterController';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ensureSTAuthenticated from '@modules/users/infra/http/middlewares/ensureSTAuthenticated';

const locationsCharactersRouter = Router();
const locationCharacterController = new LocationCharacterController();

// Locations-Characters routes
locationsCharactersRouter.post(
  '/add',
  ensureSTAuthenticated,
  celebrate({
    [Segments.BODY]: {
      char_id: Joi.string().uuid().required(),
      location_id: Joi.string().uuid().required(),
      shared: Joi.boolean().default(false).optional(),
    },
  }),
  locationCharacterController.create,
);

// Locations-Characters routes
locationsCharactersRouter.patch(
  '/update',
  ensureSTAuthenticated,
  celebrate({
    [Segments.BODY]: {
      char_id: Joi.string().uuid().required(),
      location_id: Joi.string().uuid().required(),
      shared: Joi.boolean().required(),
    },
  }),
  locationCharacterController.update,
);

locationsCharactersRouter.delete(
  '/remove',
  ensureSTAuthenticated,
  celebrate({
    [Segments.BODY]: {
      char_id: Joi.string().uuid().required(),
      location_id: Joi.string().uuid().required(),
    },
  }),
  locationCharacterController.delete,
);

// Show a location
locationsCharactersRouter.post(
  '/show',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      char_id: Joi.string().uuid().required(),
      location_id: Joi.string().uuid().required(),
    },
  }),
  locationCharacterController.show,
);

// List all characters of a location
locationsCharactersRouter.get(
  '/listchars/:id',
  ensureSTAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  locationCharacterController.index,
);

export default locationsCharactersRouter;
