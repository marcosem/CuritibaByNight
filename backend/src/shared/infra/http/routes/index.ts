import express, { Router } from 'express';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import userCharactersRouter from '@modules/characters/infra/http/routes/userCharacters.routes';
import charactersRouter from '@modules/characters/infra/http/routes/characters.routes';
import domainRouter from '@modules/characters/infra/http/routes/domain.routes';
import powersRouter from '@modules/characters/infra/http/routes/powers.routes';
import locationsRouter from '@modules/locations/infra/http/routes/locations.routes';
import locationsCharactersRouter from '@modules/locations/infra/http/routes/locationsCharacters.routes';
import addonsRouter from '@modules/locations/infra/http/routes/addons.routes';
import locationsAddonsRouter from '@modules/locations/infra/http/routes/locationsAddons.routes';
import territoriesRouter from '@modules/locations/infra/http/routes/territories.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';
import uploadConfig from '@config/upload';

const routes = Router();
const assetsMulter = uploadConfig('assets').uploadsFolder;
const avatarMulter = uploadConfig('avatar').uploadsFolder;
const locationMulter = uploadConfig('locations').uploadsFolder;

routes.use('/images', express.static(assetsMulter));
routes.use('/avatar', express.static(avatarMulter));
routes.use('/pictures', express.static(locationMulter));

routes.use('/users', usersRouter);
routes.use('/character', userCharactersRouter);
routes.use('/characters', charactersRouter);
routes.use('/powers', powersRouter);
routes.use('/domain', domainRouter);
routes.use('/locations', locationsRouter);
routes.use('/addons', addonsRouter);
routes.use('/locaddon', locationsAddonsRouter);
routes.use('/territories', territoriesRouter);
routes.use('/locchar', locationsCharactersRouter);
routes.use('/password', passwordRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/profile', profileRouter);

export default routes;
