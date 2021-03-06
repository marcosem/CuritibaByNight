import { container } from 'tsyringe';

import '@modules/characters/providers';
import '@modules/users/providers';
import '@shared/container/providers';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import ICharactersRepository from '@modules/characters/repositories/ICharactersRepository';
import CharactersRepository from '@modules/characters/infra/typeorm/repositories/CharactersRepository';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';

import ILocationsRepository from '@modules/locations/repositories/ILocationsRepository';
import LocationsRepository from '@modules/locations/infra/typeorm/repositories/LocationsRepository';

import ILocationsCharactersRepository from '@modules/locations/repositories/ILocationsCharactersRepository';
import LocationsCharactersRepository from '@modules/locations/infra/typeorm/repositories/LocationsCharactersRepository';

import ITerritoriesRepository from '@modules/locations/repositories/ITerritoriesRepository';
import TerritoriesRepository from '@modules/locations/infra/typeorm/repositories/TerritoriesRepository';

import ICharactersTraitsRepository from '@modules/characters/repositories/ICharactersTraitsRepository';
import CharactersTraitsRepository from '@modules/characters/infra/typeorm/repositories/CharactersTraitsRepository';

// Register a container with User Repositoy in the IUsersRepository format
// Register Singleton register a single instance
container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<ICharactersRepository>(
  'CharactersRepository',
  CharactersRepository,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);

container.registerSingleton<ILocationsRepository>(
  'LocationsRepository',
  LocationsRepository,
);

container.registerSingleton<ILocationsCharactersRepository>(
  'LocationsCharactersRepository',
  LocationsCharactersRepository,
);

container.registerSingleton<ITerritoriesRepository>(
  'TerritoriesRepository',
  TerritoriesRepository,
);

container.registerSingleton<ICharactersTraitsRepository>(
  'CharactersTraitsRepository',
  CharactersTraitsRepository,
);

// for another repository, just duplicate
