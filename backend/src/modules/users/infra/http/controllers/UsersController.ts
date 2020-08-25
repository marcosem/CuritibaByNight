import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListUsersService from '@modules/users/services/ListUsersService';

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
}
