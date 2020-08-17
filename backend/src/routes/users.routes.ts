import express, { Router } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';
import uploadConfig from '../config/upload';

import UsersRepository from '../repositories/UsersRepository';
import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

/*
  id: string;
  name: string;
  login: string;
  email: string;
  email_ic: string;
  phone: string;
  password: string;
  storyteller: boolean;
  avatar: string;
  */

usersRouter.post('/', async (req, res) => {
  const { name, login, email, email_ic, phone, password } = req.body;

  // const usersRepository = getCustomRepository(UsersRepository);

  const createUserService = new CreateUserService();

  const user = await createUserService.execute({
    name,
    login,
    email,
    email_ic,
    phone,
    password,
  });

  // Do not show user password
  delete user.password;
  delete user.storyteller;

  return res.json(user);
});

usersRouter.use('/image', express.static(uploadConfig.directory));

usersRouter.get('/list', async (req, res) => {
  const usersRepository = getCustomRepository(UsersRepository);
  const usersList = await usersRepository.find();

  // remove passwords
  const usersListProtected = usersList.map(user => {
    const newUser = user;
    delete newUser.password;
    return newUser;
  });

  return res.json(usersListProtected);
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (req, res) => {
    const updateUserAvatar = new UpdateUserAvatarService();

    const user = await updateUserAvatar.execute({
      user_id: req.user.id,
      avatarFilename: req.file.filename,
    });

    // Do not show user password
    delete user.password;

    return res.json(user);
  },
);

export default usersRouter;
