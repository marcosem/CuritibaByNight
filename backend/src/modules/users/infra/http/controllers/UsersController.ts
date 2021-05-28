import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListUsersService from '@modules/users/services/ListUsersService';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import RemoveUserService from '@modules/users/services/RemoveUserService';
import GetUserService from '@modules/users/services/GetUserService';
import { classToClass } from 'class-transformer';

export default class UsersController {
  public async index(req: Request, res: Response): Promise<Response> {
    const listUsers = container.resolve(ListUsersService);
    const usersList = await listUsers.execute();

    // remove passwords
    const usersListProtected = usersList.map(user => {
      const newUser = user;
      newUser.secret = '';
      return classToClass(newUser);
    });

    return res.json(usersListProtected);
  }

  public async show(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id;
    const { profile_id } = req.body;

    const profileID = profile_id || user_id;

    const getUser = container.resolve(GetUserService);

    const user = await getUser.execute({ user_id, profile_id: profileID });
    user.secret = '';

    return res.json(classToClass(user));
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id;

    const {
      profile_id,
      name,
      email,
      phone,
      old_password,
      password,
      storyteller,
      active,
      lgpd_acceptance,
    } = req.body;

    const updateProfile = container.resolve(UpdateProfileService);

    const user = await updateProfile.execute({
      user_id,
      profile_id,
      name,
      email,
      phone,
      old_password,
      password,
      storyteller,
      active,
      lgpd_acceptance,
    });

    user.secret = '';

    return res.json(classToClass(user));
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id;
    const { profile_id } = req.body;

    const removeUser = container.resolve(RemoveUserService);

    await removeUser.execute({ user_id, profile_id });

    return res.status(204).json();
  }
}
