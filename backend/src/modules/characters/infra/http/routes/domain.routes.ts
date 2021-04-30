import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ensureSTAuthenticated from '@modules/users/infra/http/middlewares/ensureSTAuthenticated';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import DomainMasqueradeController from '@modules/characters/infra/http/controllers/DomainMasqueradeController';

const domainRouter = Router();
const domainMasqueradeController = new DomainMasqueradeController();

// Return current masquerade level
domainRouter.get(
  '/masqueradeLevel',
  ensureAuthenticated,
  domainMasqueradeController.show,
);

// Set current masquerade level
domainRouter.patch(
  '/setMasqueradeLevel',
  ensureSTAuthenticated,
  celebrate({
    [Segments.BODY]: {
      masquerade_level: Joi.number().min(0).max(10).required(),
    },
  }),
  domainMasqueradeController.update,
);

export default domainRouter;
