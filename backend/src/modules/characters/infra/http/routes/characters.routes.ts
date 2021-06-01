import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ensureSTAuthenticated from '@modules/users/infra/http/middlewares/ensureSTAuthenticated';
import CharactersController from '@modules/characters/infra/http/controllers/CharactersController';
import CharactersInfluencesController from '@modules/characters/infra/http/controllers/CharactersInfluencesController';

const charactersRouter = Router();
const charactersController = new CharactersController();
const charactersInfluencesController = new CharactersInfluencesController();

charactersRouter.use(ensureSTAuthenticated);

// Show characters list
charactersRouter.get(
  '/list/:filter',
  celebrate({
    [Segments.PARAMS]: {
      filter: Joi.valid('all', 'pc', 'npc').optional(),
    },
  }),
  charactersController.index,
);

// Show characters list
charactersRouter.get('/influences', charactersInfluencesController.index);

export default charactersRouter;
