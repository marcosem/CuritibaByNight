import { container } from 'tsyringe';

import '@modules/characters/providers';
import '@modules/users/providers';
import '@shared/container/providers';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

// import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
// import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';

// Register a container with User Repositoy in the IUsersRepository format
// Register Singleton register a single instance
container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

// for another repository, just duplicate
