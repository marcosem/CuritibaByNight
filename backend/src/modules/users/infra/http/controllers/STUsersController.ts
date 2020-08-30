import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateSTUserService from '@modules/users/services/CreateSTUserService';

export default class STUsersController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { name, email, phone, password, st_secret } = req.body;

    const createUserService = container.resolve(CreateSTUserService);

    const user = await createUserService.execute({
      name,
      email,
      phone,
      password,
      st_secret,
    });

    // Do not show user password
    delete user.password;

    return res.json(user);
  }
}
