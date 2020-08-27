import express, { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';

import STUsersController from '@modules/users/infra/http/controllers/STUsersController';
import UsersController from '@modules/users/infra/http/controllers/UsersController';
import InitialUsersController from '@modules/users/infra/http/controllers/InitialUsersController';
import CharactersController from '@modules/characters/infra/http/controllers/CharactersController';
import UserAvatarController from '@modules/users/infra/http/controllers/UserAvatarController';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ensureSTAuthenticated from '@modules/users/infra/http/middlewares/ensureSTAuthenticated';

const usersRouter = Router();

const sTUsersController = new STUsersController();
const usersController = new UsersController();
const initialUsersController = new InitialUsersController();
const userAvatarController = new UserAvatarController();
const charactersController = new CharactersController();

const avatarMulter = uploadConfig('avatar');
const sheetMulter = uploadConfig('sheet');
const uploadAvatar = multer(avatarMulter);
const uploadSheet = multer(sheetMulter);

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

// Character sheet routes
usersRouter.patch(
  '/uploadsheet',
  ensureSTAuthenticated,
  uploadSheet.single('sheet'),
  charactersController.update,
);

// Show my character sheet
usersRouter.get('/sheet', ensureAuthenticated, charactersController.show);

// Show any character sheet - Only ST may do that
usersRouter.post('/sheet', ensureSTAuthenticated, charactersController.index);

export default usersRouter;
