import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';
import { celebrate, Segments, Joi } from 'celebrate';
import CharactersController from '@modules/characters/infra/http/controllers/CharactersController';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ensureSTAuthenticated from '@modules/users/infra/http/middlewares/ensureSTAuthenticated';

const usersRouter = Router();

const charactersController = new CharactersController();

const sheetMulter = uploadConfig('sheet');
const uploadSheet = multer(sheetMulter);

// Character sheet routes
usersRouter.post(
  '/add',
  ensureSTAuthenticated,
  uploadSheet.single('sheet'),
  charactersController.create,
);

usersRouter.patch(
  '/update',
  ensureSTAuthenticated,
  uploadSheet.single('sheet'),
  charactersController.update,
);

// Show my character sheet
usersRouter.get(
  '/:id',
  ensureAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  charactersController.show,
);

// Show user character sheet list
usersRouter.post(
  '/list',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      player_id: Joi.string().uuid().required(),
    },
  }),
  charactersController.index,
);

export default usersRouter;
