import { Router } from 'express';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import charactersRouter from '@modules/characters/infra/http/routes/characters.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/character', charactersRouter);
routes.use('/password', passwordRouter);
routes.use('/sessions', sessionsRouter);

export default routes;
