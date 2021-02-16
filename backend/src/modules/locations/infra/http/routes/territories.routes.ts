import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import TerritoriesController from '@modules/locations/infra/http/controllers/TerritoriesController';
import ensureSTAuthenticated from '@modules/users/infra/http/middlewares/ensureSTAuthenticated';

const territoriesRouter = Router();
const territoriesController = new TerritoriesController();

territoriesRouter.post(
  '/add',
  ensureSTAuthenticated,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      population: Joi.number().required(),
      sect: Joi.string().optional(),
    },
  }),
  territoriesController.create,
);

territoriesRouter.patch(
  '/update',
  ensureSTAuthenticated,
  celebrate({
    [Segments.BODY]: {
      territory_id: Joi.string().uuid().required(),
      name: Joi.string().required(),
      population: Joi.number().required(),
      sect: Joi.string().optional(),
    },
  }),
  territoriesController.update,
);

territoriesRouter.delete(
  '/remove',
  ensureSTAuthenticated,
  celebrate({
    [Segments.BODY]: {
      territory_id: Joi.string().uuid().required(),
    },
  }),
  territoriesController.delete,
);

territoriesRouter.post(
  '/show',
  ensureSTAuthenticated,
  celebrate({
    [Segments.BODY]: {
      territory_id: Joi.string().uuid().optional(),
      name: Joi.string().optional(),
    },
  }),
  territoriesController.show,
);

territoriesRouter.get(
  '/list',
  ensureSTAuthenticated,
  territoriesController.index,
);

export default territoriesRouter;
