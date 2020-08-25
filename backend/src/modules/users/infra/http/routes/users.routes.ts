import express, { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';
import { container } from 'tsyringe';

import CreateSTUserService from '@modules/users/services/CreateSTUserService';
import CreateInitialUserService from '@modules/users/services/CreateInitialUserService';
import CompleteInitialUserService from '@modules/users/services/CompleteInitialUserService';
import GetInitialUserService from '@modules/users/services/GetInitialUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import UploadCharacterSheetService from '@modules/characters/services/UploadCharacterSheetService';
import GetUserCharacterSheet from '@modules/characters/services/GetUserCharacterSheet';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ensureSTAuthenticated from '@modules/users/infra/http/middlewares/ensureSTAuthenticated';

const usersRouter = Router();

const avatarMulter = uploadConfig('avatar');
const sheetMulter = uploadConfig('sheet');
const uploadAvatar = multer(avatarMulter);
const uploadSheet = multer(sheetMulter);

usersRouter.post('/createst', async (req, res) => {
  const { name, email, email_ic, phone, password, st_secret } = req.body;

  const createUserService = container.resolve(CreateSTUserService);

  const user = await createUserService.execute({
    name,
    email,
    email_ic,
    phone,
    password,
    st_secret,
  });

  // Do not show user password
  delete user.password;

  return res.json(user);
});

usersRouter.get('/complete/:id', async (req, res) => {
  const { id } = req.params;

  const getUserService = container.resolve(GetInitialUserService);

  const user = await getUserService.execute({ secret: id });

  delete user.password;
  delete user.secret;
  delete user.storyteller;

  return res.json(user);
});

usersRouter.post('/complete', async (req, res) => {
  const { name, email, email_ic, phone, password, secret } = req.body;

  const createUserService = container.resolve(CompleteInitialUserService);

  const user = await createUserService.execute({
    name,
    email,
    email_ic,
    phone,
    password,
    secret,
  });

  // Do not show user password
  delete user.password;
  delete user.secret;
  delete user.storyteller;

  return res.json(user);
});

usersRouter.post('/create', ensureSTAuthenticated, async (req, res) => {
  const { name, email, email_ic, phone } = req.body;

  const createInitialUserService = container.resolve(CreateInitialUserService);

  const user = await createInitialUserService.execute({
    name,
    email,
    email_ic,
    phone,
  });

  // Do not show user password
  delete user.password;
  delete user.storyteller;

  return res.json(user);
});

usersRouter.use('/image', express.static(avatarMulter.directory));

/*
usersRouter.get('/list', ensureSTAuthenticated, async (req, res) => {
  // const usersRepository = getCustomRepository(UsersRepository);
  const usersList = await usersRepository.find();

  // remove passwords
  const usersListProtected = usersList.map(user => {
    const newUser = user;
    delete newUser.password;
    delete newUser.secret;
    return newUser;
  });

  return res.json(usersListProtected);
});
*/

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  uploadAvatar.single('avatar'),
  async (req, res) => {
    const updateUserAvatar = container.resolve(UpdateUserAvatarService);

    const user = await updateUserAvatar.execute({
      user_id: req.user.id,
      avatarFilename: req.file.filename,
    });

    // Do not show user password
    delete user.password;
    delete user.secret;

    return res.json(user);
  },
);

usersRouter.patch(
  '/uploadsheet',
  ensureSTAuthenticated,
  uploadSheet.single('sheet'),
  async (req, res) => {
    const { player_id } = req.body;

    const uploadCharacterSheetService = container.resolve(
      UploadCharacterSheetService,
    );

    const user = await uploadCharacterSheetService.execute({
      user_id: req.user.id,
      player_id,
      sheetFilename: req.file.filename,
    });

    delete user.password;
    delete user.secret;

    return res.json(user);
  },
);

usersRouter.get('/sheet', ensureAuthenticated, async (req, res) => {
  const getUserCharacterSheet = container.resolve(GetUserCharacterSheet);

  const sheet = await getUserCharacterSheet.execute({
    user_id: req.user.id,
    player_id: req.user.id,
  });

  return res.sendFile(sheet);
});

usersRouter.post('/sheet', ensureSTAuthenticated, async (req, res) => {
  const { player_id } = req.body;

  const getUserCharacterSheet = container.resolve(GetUserCharacterSheet);

  const sheet = await getUserCharacterSheet.execute({
    user_id: req.user.id,
    player_id,
  });

  return res.sendFile(sheet);
});

export default usersRouter;
