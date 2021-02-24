import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';
import { celebrate, Segments, Joi } from 'celebrate';

import LocationsController from '@modules/locations/infra/http/controllers/LocationsController';
import LocationPictureController from '@modules/locations/infra/http/controllers/LocationPictureController';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ensureSTAuthenticated from '@modules/users/infra/http/middlewares/ensureSTAuthenticated';

const locationsRouter = Router();

const locationsController = new LocationsController();
const locationPictureController = new LocationPictureController();

const locationsMulter = uploadConfig('locations');
const uploadLocation = multer(locationsMulter.multer);

// Locations routes
locationsRouter.post(
  '/add',
  ensureSTAuthenticated,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      description: Joi.string().required(),
      address: Joi.string().optional(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      elysium: Joi.boolean().optional(),
      type: Joi.valid(
        'haven',
        'airport',
        'camp',
        'castle',
        'haunt',
        'holding',
        'mansion',
        'nightclub',
        'university',
        'other',
      ).optional(),
      level: Joi.number().min(0).max(6).optional(),
      mystical_level: Joi.number().min(0).max(6).optional(),
      property: Joi.valid(
        'public',
        'private',
        'clan',
        'creature',
        'sect',
      ).optional(),
      clan: Joi.string().allow(null).optional(),
      creature_type: Joi.valid(
        'Changeling',
        'Demon',
        'Fera',
        'Kuei-Jin',
        'Mage',
        'Mortal',
        'Mummy',
        'Vampire',
        'Werewolf',
        'Wraith',
        'Other',
      )
        .allow(null)
        .optional(),
      sect: Joi.string().allow(null).optional(),
      char_id: Joi.string().uuid().allow(null).optional(),
    },
  }),
  locationsController.create,
);

locationsRouter.patch(
  '/update',
  ensureSTAuthenticated,
  celebrate({
    [Segments.BODY]: {
      location_id: Joi.string().uuid().required(),
      name: Joi.string().optional(),
      description: Joi.string().optional(),
      address: Joi.string().optional(),
      latitude: Joi.number().optional(),
      longitude: Joi.number().optional(),
      elysium: Joi.boolean().optional(),
      type: Joi.valid(
        'haven',
        'airport',
        'camp',
        'castle',
        'haunt',
        'holding',
        'mansion',
        'nightclub',
        'university',
        'other',
      ).optional(),
      level: Joi.number().min(0).max(6).optional(),
      mystical_level: Joi.number().min(0).max(6).optional(),
      property: Joi.valid(
        'public',
        'private',
        'clan',
        'creature',
        'sect',
      ).optional(),
      clan: Joi.string().allow(null).optional(),
      creature_type: Joi.valid(
        'Changeling',
        'Demon',
        'Fera',
        'Kuei-Jin',
        'Mage',
        'Mortal',
        'Mummy',
        'Vampire',
        'Werewolf',
        'Wraith',
        'Other',
      )
        .allow(null)
        .optional(),
      sect: Joi.string().allow(null).optional(),
      char_id: Joi.string().uuid().allow(null).optional(),
    },
  }),
  locationsController.update,
);

locationsRouter.delete(
  '/remove',
  ensureSTAuthenticated,
  celebrate({
    [Segments.BODY]: {
      location_id: Joi.string().uuid().required(),
    },
  }),
  locationsController.delete,
);

// Show a location
locationsRouter.post(
  '/show',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      location_id: Joi.string().uuid().required(),
      char_id: Joi.string().uuid().optional(),
    },
  }),
  locationsController.show,
);

// Show locations list
locationsRouter.post(
  '/list',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      char_id: Joi.string().uuid().optional(),
    },
  }),
  locationsController.index,
);

locationsRouter.patch(
  '/picture/:id',
  ensureSTAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  uploadLocation.single('locations'),
  locationPictureController.update,
);

export default locationsRouter;
