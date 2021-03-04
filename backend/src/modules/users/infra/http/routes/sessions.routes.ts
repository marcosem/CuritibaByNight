import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import SessionsController from '@modules/users/infra/http/controllers/SessionsController';

const sessionsController = new SessionsController();
const sessionsRouter = Router();

sessionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  sessionsController.create,
);

sessionsRouter.post(
  '/refresh',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().required(),
      refresh_token: Joi.string().required(),
    },
  }),
  sessionsController.update,
);

export default sessionsRouter;
