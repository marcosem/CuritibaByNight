import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ensureSTAuthenticated from '@modules/users/infra/http/middlewares/ensureSTAuthenticated';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import InfluenceActionsController from '@modules/influences/infra/http/controllers/InfluenceActionsController';
import InfluenceActionsReviewsController from '@modules/influences/infra/http/controllers/InfluenceActionsReviewsController';
import CurrentActionMonthController from '@modules/influences/infra/http/controllers/CurrentActionMonthController';

const influenceActionsRouter = Router();
const influenceActionsController = new InfluenceActionsController();
const influenceActionsReviewsController = new InfluenceActionsReviewsController();
const currentActionMonthConstroller = new CurrentActionMonthController();

// Influence Actions routes
// Create a new influence action
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

// Update an influence action - user level
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

// List all influence action - depending on user access permission
influenceActionsRouter.post(
  '/list',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      char_id: Joi.string().uuid().allow(null).optional(),
      action_period: Joi.string().allow(null).optional(),
      pending_only: Joi.boolean().optional(),
    },
  }),
  influenceActionsController.index,
);

// Delete an influence action
influenceActionsRouter.delete(
  '/delete',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().uuid().required(),
    },
  }),
  influenceActionsController.delete,
);

// Update an influence action - user level
influenceActionsRouter.patch(
  '/review',
  ensureSTAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().uuid().required(),
      st_reply: Joi.string().allow(null, '').required(),
      result: Joi.valid(
        'success',
        'partial',
        'fail',
        'not evaluated',
      ).required(),
      news: Joi.string().allow(null, '').optional(),
    },
  }),
  influenceActionsReviewsController.update,
);

influenceActionsRouter.get(
  '/read/:id',
  ensureSTAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  influenceActionsReviewsController.show,
);

influenceActionsRouter.get(
  '/currentMonth',
  ensureAuthenticated,
  currentActionMonthConstroller.show,
);

influenceActionsRouter.patch(
  '/setCurrentMonth',
  ensureSTAuthenticated,
  celebrate({
    [Segments.BODY]: {
      action_month: Joi.string()
        .regex(/(19|20)\d{2}-(0[1-9]|1[012])/)
        .required(),
    },
  }),
  currentActionMonthConstroller.update,
);

// Get an influence action by its id
influenceActionsRouter.get(
  '/:id',
  ensureAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  influenceActionsController.show,
);

export default influenceActionsRouter;
