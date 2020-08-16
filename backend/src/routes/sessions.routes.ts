import { Router } from 'express';
import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (req, res) => {
  const { login, password } = req.body;

  const authenticateUser = new AuthenticateUserService();

  const { user, token } = await authenticateUser.execute({ login, password });

  delete user.password;

  return res.json({ user, token });
});

export default sessionsRouter;
