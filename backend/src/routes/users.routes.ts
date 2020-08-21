import express, { Router } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';
import uploadConfig from '../config/upload';

import UsersRepository from '../repositories/UsersRepository';
import CreateSTUserService from '../services/CreateSTUserService';
import CreateInitialUserService from '../services/CreateInitialUserService';
import CompleteInitialUserService from '../services/CompleteInitialUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';
import UploadCharacterSheetService from '../services/UploadCharacterSheetService';
import GetUserCharacterSheet from '../services/GetUserCharacterSheet';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import ensureSTAuthenticated from '../middlewares/ensureSTAuthenticated';

const usersRouter = Router();
const avatarMulter = uploadConfig('avatar');
const sheetMulter = uploadConfig('sheet');
const uploadAvatar = multer(avatarMulter);
const uploadSheet = multer(sheetMulter);

// const uploadSheet = multer(uploadConfig('sheet'));

/*
  id: string;
  name: string;
  email: string;
  email_ic: string;
  phone: string;
  password: string;
  storyteller: boolean;
  secret: string;
  avatar: string;
  */

usersRouter.post('/createst', async (req, res) => {
  const { name, email, email_ic, phone, password, st_secret } = req.body;

  const createUserService = new CreateSTUserService();

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

usersRouter.post('/complete', async (req, res) => {
  const { name, email, email_ic, phone, password, secret } = req.body;

  const createUserService = new CompleteInitialUserService();

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

  const createInitialUserService = new CreateInitialUserService();

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

usersRouter.get('/list', ensureSTAuthenticated, async (req, res) => {
  const usersRepository = getCustomRepository(UsersRepository);
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

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  uploadAvatar.single('avatar'),
  async (req, res) => {
    const updateUserAvatar = new UpdateUserAvatarService();

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

    const uploadCharacterSheetService = new UploadCharacterSheetService();

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
  const getUserCharacterSheet = new GetUserCharacterSheet();

  const sheet = await getUserCharacterSheet.execute({
    user_id: req.user.id,
  });

  return res.sendFile(sheet);
});

export default usersRouter;
