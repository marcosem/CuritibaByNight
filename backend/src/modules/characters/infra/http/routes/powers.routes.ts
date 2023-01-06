import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ensureSTAuthenticated from '@modules/users/infra/http/middlewares/ensureSTAuthenticated';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import PowersControllers from '@modules/characters/infra/http/controllers/PowersController';

const powersRouter = Router();
const powersController = new PowersControllers();

// Power routes
powersRouter.post(
  '/add',
  ensureSTAuthenticated,
  celebrate({
    [Segments.BODY]: {
      long_name: Joi.string().required(),
      short_name: Joi.string().required(),
      level: Joi.number().min(0).max(10).required(),
      type: Joi.valid(
        'discipline',
        'combination',
        'ritual',
        'gift',
        'arcanoi',
        'spheres',
        'routes',
        'other',
      ).optional(),
      origin: Joi.string().allow(null, '').optional(),
      requirements: Joi.string().allow(null, '').optional(),
      description: Joi.string().required(),
      system: Joi.string().required(),
      cost: Joi.number().default(0).optional(),
      source: Joi.string().allow(null, '').optional(),
    },
  }),
  powersController.create,
);

// Show powers list
powersRouter.get('/list', ensureSTAuthenticated, powersController.index);

powersRouter.get(
  '/list/:id',
  ensureAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  powersController.index,
);

export default powersRouter;
