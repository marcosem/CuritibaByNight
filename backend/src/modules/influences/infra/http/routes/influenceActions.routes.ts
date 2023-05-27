import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
// import ensureSTAuthenticated from '@modules/users/infra/http/middlewares/ensureSTAuthenticated';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import InfluenceActionsController from '@modules/influences/infra/http/controllers/InfluenceActionsController';

const influenceActionsRouter = Router();
const influenceActionsController = new InfluenceActionsController();

// Influence Actions routes
influenceActionsRouter.post(
  '/add',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      title: Joi.string().required(),
      action_period: Joi.string()
        .regex(/^(20)\d\d([-])(0[1-9]|1[012])$/)
        .required(),
      backgrounds: Joi.string().allow(null, '').optional(),
      influence: Joi.valid(
        'Bureaucracy',
        'Church',
        'Finance',
        'Health',
        'High Society',
        'Industry',
        'Legal',
        'Media',
        'Occult',
        'Police',
        'Politics',
        'Street',
        'Transportation',
        'Underworld',
        'University',
      ).required(),
      influence_level: Joi.number().min(1).max(20).required(),
      ability: Joi.string().allow(null, '').optional(),
      ability_level: Joi.number().default(0).optional(),
      endeavor: Joi.valid(
        'attack',
        'defend',
        'combine',
        'raise capital',
        'other',
      ).required(),
      character_id: Joi.string().uuid().required(),
      action_owner_id: Joi.string().uuid().optional(),
      action: Joi.string().allow(null, '').optional(),
    },
  }),
  influenceActionsController.create,
);

influenceActionsRouter.patch(
  '/update',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().uuid().required(),
      title: Joi.string().required(),
      action_period: Joi.string()
        .regex(/^(20)\d\d([-])(0[1-9]|1[012])$/)
        .required(),
      backgrounds: Joi.string().allow(null, '').optional(),
      influence: Joi.valid(
        'Bureaucracy',
        'Church',
        'Finance',
        'Health',
        'High Society',
        'Industry',
        'Legal',
        'Media',
        'Occult',
        'Police',
        'Politics',
        'Street',
        'Transportation',
        'Underworld',
        'University',
      ).required(),
      influence_level: Joi.number().min(1).max(20).required(),
      ability: Joi.string().allow(null, '').optional(),
      ability_level: Joi.number().default(0).optional(),
      endeavor: Joi.valid(
        'attack',
        'defend',
        'combine',
        'raise capital',
        'other',
      ).required(),
      character_id: Joi.string().uuid().required(),
      action_owner_id: Joi.string().uuid().optional(),
      action: Joi.string().allow(null, '').optional(),
    },
  }),
  influenceActionsController.update,
);

export default influenceActionsRouter;
