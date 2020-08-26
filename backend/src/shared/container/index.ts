import { container } from 'tsyringe';

import '@modules/users/providers';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

// Register a container with User Repositoy in the IUserRepository format
// Register Singleton register a single instance
container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

// for another repository, just duplicate
