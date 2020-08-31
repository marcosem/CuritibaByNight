import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListUsersService from '@modules/users/services/ListUsersService';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import GetUserService from '@modules/users/services/GetUserService';

export default class UsersController {
  public async index(req: Request, res: Response): Promise<Response> {
    const listUsers = container.resolve(ListUsersService);
    const usersList = await listUsers.execute();

    // remove passwords
    const usersListProtected = usersList.map(user => {
      const newUser = user;
      delete newUser.password;
      delete newUser.secret;
      return newUser;
    });

    return res.json(usersListProtected);
  }

  public async show(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id;
    const { profile_id } = req.body;

    const profileID = profile_id || user_id;

    const getUser = container.resolve(GetUserService);

    const user = await getUser.execute(profileID);

    delete user.password;
    delete user.secret;

    return res.json(user);
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
    });

    delete user.password;
    delete user.secret;

    return res.json(user);
  }
}
