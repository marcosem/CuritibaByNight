import express, { Router } from 'express';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import charactersRouter from '@modules/characters/infra/http/routes/characters.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';
import uploadConfig from '@config/upload';

const routes = Router();
const assetsMulter = uploadConfig('assets').uploadsFolder;
const avatarMulter = uploadConfig('avatar').uploadsFolder;

routes.use('/images', express.static(assetsMulter));
routes.use('/avatar', express.static(avatarMulter));

routes.use('/users', usersRouter);
routes.use('/character', charactersRouter);
routes.use('/password', passwordRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/profile', profileRouter);

export default routes;
