import { Request, Response } from 'express';
import { container } from 'tsyringe';
import GetInitialUserService from '@modules/users/services/GetInitialUserService';
import CreateInitialUserService from '@modules/users/services/CreateInitialUserService';
import CompleteInitialUserService from '@modules/users/services/CompleteInitialUserService';
import { classToClass } from 'class-transformer';

// index, show, create, update, delete
export default class InitialUsersController {
  public async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const getUserService = container.resolve(GetInitialUserService);

    const user = await getUserService.execute({ secret: id });

    // delete user.password;
    user.secret = '';

    return res.json(classToClass(user));
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { name, email, phone } = req.body;

    const createInitialUserService = container.resolve(
      CreateInitialUserService,
    );

    const user = await createInitialUserService.execute({
      name,
      email,
      phone,
    });

    // Do not show user password
    // delete user.password;

    return res.json(classToClass(user));
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { name, email, phone, password, secret, lgpd_acceptance } = req.body;

    const createUserService = container.resolve(CompleteInitialUserService);

    const user = await createUserService.execute({
      name,
      email,
      phone,
      password,
      secret,
      lgpd_acceptance,
    });

    // Do not show user password
    // delete user.password;
    user.secret = '';

    return res.json(classToClass(user));
  }
}
