import express, { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';
import { celebrate, Segments, Joi } from 'celebrate';
import UserCharactersController from '@modules/characters/infra/http/controllers/UserCharactersController';
import CharacterAvatarController from '@modules/characters/infra/http/controllers/CharacterAvatarController';
import CharactersRetainersController from '@modules/characters/infra/http/controllers/CharactersRetainersController';
import CharactersTraitsController from '@modules/characters/infra/http/controllers/CharactersTraitsController';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ensureSTAuthenticated from '@modules/users/infra/http/middlewares/ensureSTAuthenticated';

const userCharactersRouter = Router();

const userCharactersController = new UserCharactersController();
const characterAvatarController = new CharacterAvatarController();
const charactersRetainersController = new CharactersRetainersController();
const charactersTraitsController = new CharactersTraitsController();

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

userCharactersRouter.patch(
  '/update',
  ensureSTAuthenticated,
  uploadSheet.single('sheet'),
  userCharactersController.update,
);

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

// Update user character retainers XP
userCharactersRouter.patch(
  '/updateretainers',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      character_id: Joi.string().uuid().required(),
      situation: Joi.string(),
    },
  }),
  charactersRetainersController.update,
);

// Show user character retainers list
userCharactersRouter.post(
  '/retainerslist',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      character_id: Joi.string().uuid().required(),
      situation: Joi.string(),
    },
  }),
  charactersRetainersController.index,
);

userCharactersRouter.get(
  '/traits/:id',
  ensureAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  charactersTraitsController.index,
);

userCharactersRouter.patch(
  '/traits/update',
  ensureSTAuthenticated,
  celebrate({
    [Segments.BODY]: {
      character_id: Joi.string().uuid().required(),
      trait_id: Joi.string().uuid().required(),
      trait_name: Joi.string().required(),
      trait_type: Joi.string().required(),
      trait_level: Joi.number().min(0).required(),
      trait_level_temp: Joi.string().optional(),
    },
  }),
  charactersTraitsController.update,
);

userCharactersRouter.delete(
  '/traits/reset',
  ensureSTAuthenticated,
  celebrate({
    [Segments.BODY]: {
      character_id: Joi.string().uuid().required(),
      keep_masquerade: Joi.boolean().required(),
    },
  }),
  charactersTraitsController.delete,
);

export default userCharactersRouter;
