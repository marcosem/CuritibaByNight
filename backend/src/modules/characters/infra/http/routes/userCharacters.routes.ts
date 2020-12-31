import express, { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';
import { celebrate, Segments, Joi } from 'celebrate';
import UserCharactersController from '@modules/characters/infra/http/controllers/UserCharactersController';
import CharacterAvatarController from '@modules/characters/infra/http/controllers/CharacterAvatarController';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ensureSTAuthenticated from '@modules/users/infra/http/middlewares/ensureSTAuthenticated';

const userCharactersRouter = Router();

const userCharactersController = new UserCharactersController();
const characterAvatarController = new CharacterAvatarController();

const sheetMulter = uploadConfig('sheet');
const uploadSheet = multer(sheetMulter.multer);

const avatarMulter = uploadConfig('avatar');
const uploadAvatar = multer(avatarMulter.multer);

// Character sheet routes
userCharactersRouter.post(
  '/add',
  ensureSTAuthenticated,
  uploadSheet.single('sheet'),
  userCharactersController.create,
);
/*
  celebrate({
    [Segments.BODY]: {
      player_id: Joi.string().uuid().optional(),
      is_npc: Joi.boolean().default(false),
    },
  }),
*/

userCharactersRouter.patch(
  '/update',
  ensureSTAuthenticated,
  uploadSheet.single('sheet'),
  userCharactersController.update,
);
/*
  celebrate({
    [Segments.BODY]: {
      character_id: Joi.string().uuid().required(),
      situation: Joi.string().optional(),
      comments: Joi.string().optional(),
      is_npc: Joi.boolean().default(false),
    },
  }),
*/

userCharactersRouter.delete(
  '/remove',
  ensureSTAuthenticated,
  celebrate({
    [Segments.BODY]: {
      character_id: Joi.string().uuid().required(),
    },
  }),
  userCharactersController.delete,
);

userCharactersRouter.use('/sheet', express.static(sheetMulter.uploadsFolder));

userCharactersRouter.patch(
  '/avatar/:id',
  ensureAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  uploadAvatar.single('avatar'),
  characterAvatarController.update,
);

// Show my character sheet
userCharactersRouter.get(
  '/:id',
  ensureAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  userCharactersController.show,
);

// Show user character sheet list
userCharactersRouter.post(
  '/list',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      player_id: Joi.string().uuid().required(),
      situation: Joi.string(),
    },
  }),
  userCharactersController.index,
);

export default userCharactersRouter;
