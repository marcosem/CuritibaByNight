import { Router } from 'express';

import UsersController from '@modules/users/infra/http/controllers/UsersController';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const profileRouter = Router();

const usersController = new UsersController();

profileRouter.use(ensureAuthenticated);

profileRouter.put('/update', usersController.update);
profileRouter.post('/', usersController.show);

export default profileRouter;
