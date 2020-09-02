import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';
import { celebrate, Segments, Joi } from 'celebrate';

import STUsersController from '@modules/users/infra/http/controllers/STUsersController';
import UsersController from '@modules/users/infra/http/controllers/UsersController';
import InitialUsersController from '@modules/users/infra/http/controllers/InitialUsersController';
import UserAvatarController from '@modules/users/infra/http/controllers/UserAvatarController';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ensureSTAuthenticated from '@modules/users/infra/http/middlewares/ensureSTAuthenticated';

const usersRouter = Router();

const sTUsersController = new STUsersController();
const usersController = new UsersController();
const initialUsersController = new InitialUsersController();
const userAvatarController = new UserAvatarController();

const avatarMulter = uploadConfig('avatar');
const uploadAvatar = multer(avatarMulter);

// Storyteller users routes
usersRouter.post(
  '/createst',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().regex(/^$|([0-9]{2}-[0-9]{4,5}-[0-9]{4})$/),
      password: Joi.string().required(),
      st_secret: Joi.string(),
    },
  }),
  sTUsersController.create,
);

// Initial Users Routes
// Show a single by secret
usersRouter.get(
  '/complete/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  initialUsersController.show,
);

// Update initial user
usersRouter.post(
  '/complete',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().regex(/^$|([0-9]{2}-[0-9]{4,5}-[0-9]{4})$/),
      password: Joi.string().required(),
      secret: Joi.string().uuid().required(),
    },
  }),
  initialUsersController.update,
);

// Create initial user - ST only
usersRouter.post(
  '/create',
  ensureSTAuthenticated,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().regex(/^$|([0-9]{2}-[0-9]{4,5}-[0-9]{4})$/),
    },
  }),
  initialUsersController.create,
);

usersRouter.get('/list', ensureSTAuthenticated, usersController.index);

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  uploadAvatar.single('avatar'),
  userAvatarController.update,
);

usersRouter.delete(
  '/remove',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      profile_id: Joi.string().uuid(),
    },
  }),
  usersController.delete,
);

export default usersRouter;
