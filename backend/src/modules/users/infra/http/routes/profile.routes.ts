import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import UsersController from '@modules/users/infra/http/controllers/UsersController';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const profileRouter = Router();

const usersController = new UsersController();

profileRouter.use(ensureAuthenticated);

profileRouter.put(
  '/update',
  celebrate({
    [Segments.BODY]: {
      profile_id: Joi.string().uuid(),
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().regex(/^$|([0-9]{2}-[0-9]{4,5}-[0-9]{4})$/),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
      storyteller: Joi.boolean().default(false),
    },
  }),
  usersController.update,
);
profileRouter.post('/', usersController.show);

export default profileRouter;
