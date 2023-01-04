import { Router } from 'express';
// import { celebrate, Segments, Joi } from 'celebrate';
import ensureSTAuthenticated from '@modules/users/infra/http/middlewares/ensureSTAuthenticated';
import PowersControllers from '@modules/characters/infra/http/controllers/PowersController';

const powersRouter = Router();
const charactersController = new PowersControllers();

powersRouter.use(ensureSTAuthenticated);

// Show characters list
powersRouter.get(
  '/list',
  /* celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().optional(),
    },
  }), */
  charactersController.index,
);

export default powersRouter;
