import express, { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';

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
usersRouter.post('/createst', sTUsersController.create);

// Initial Users Routes
// Show a single by secret
usersRouter.get('/complete/:id', initialUsersController.show);
// Update initial user
usersRouter.post('/complete', initialUsersController.update);
// Create initial user - ST only
usersRouter.post(
  '/create',
  ensureSTAuthenticated,
  initialUsersController.create,
);

usersRouter.use('/image', express.static(avatarMulter.uploadsFolder));

usersRouter.get('/list', ensureSTAuthenticated, usersController.index);

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  uploadAvatar.single('avatar'),
  userAvatarController.update,
);

export default usersRouter;
