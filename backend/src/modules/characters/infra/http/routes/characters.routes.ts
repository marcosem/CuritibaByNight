import { Router } from 'express';
import ensureSTAuthenticated from '@modules/users/infra/http/middlewares/ensureSTAuthenticated';
import CharactersController from '@modules/characters/infra/http/controllers/CharactersController';

const charactersRouter = Router();
const charactersController = new CharactersController();

charactersRouter.use(ensureSTAuthenticated);

// Show characters list
charactersRouter.get('/list', charactersController.index);

export default charactersRouter;
