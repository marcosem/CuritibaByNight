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

import IAddonsRepository from '@modules/locations/repositories/IAddonsRepository';
import AddonsRepository from '@modules/locations/infra/typeorm/repositories/AddonsRepository';

import ILocationsAddonsRepository from '@modules/locations/repositories/ILocationsAddonsRepository';
import LocationsAddonsRepository from '@modules/locations/infra/typeorm/repositories/LocationsAddonsRepository';

import ITerritoriesRepository from '@modules/locations/repositories/ITerritoriesRepository';
import TerritoriesRepository from '@modules/locations/infra/typeorm/repositories/TerritoriesRepository';

import ICharactersTraitsRepository from '@modules/characters/repositories/ICharactersTraitsRepository';
import CharactersTraitsRepository from '@modules/characters/infra/typeorm/repositories/CharactersTraitsRepository';

import ILocationAvailableTraitsRepository from '@modules/locations/repositories/ILocationAvailableTraitsRepository';
import LocationAvailableTraitsRepository from '@modules/locations/infra/typeorm/repositories/LocationAvailableTraitsRepository';

import ILocationsTraitsRepository from '@modules/locations/repositories/ILocationsTraitsRepository';
import LocationsTraitsRepository from '@modules/locations/infra/typeorm/repositories/LocationsTraitsRepository';

import IPowersRepository from '@modules/characters/repositories/IPowersRepository';
import PowersRepository from '@modules/characters/infra/typeorm/repositories/PowersRepository';

import IInfluenceActionRepository from '@modules/influences/repositories/IInfluenceActionRepository';
import InfluenceActionRepository from '@modules/influences/infra/typeorm/repositories/InfluenceActionRepository';

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

container.registerSingleton<IAddonsRepository>(
  'AddonsRepository',
  AddonsRepository,
);

container.registerSingleton<ILocationsAddonsRepository>(
  'LocationsAddonsRepository',
  LocationsAddonsRepository,
);

container.registerSingleton<ITerritoriesRepository>(
  'TerritoriesRepository',
  TerritoriesRepository,
);

container.registerSingleton<ICharactersTraitsRepository>(
  'CharactersTraitsRepository',
  CharactersTraitsRepository,
);

container.registerSingleton<ILocationAvailableTraitsRepository>(
  'LocationAvailableTraitsRepository',
  LocationAvailableTraitsRepository,
);

container.registerSingleton<ILocationsTraitsRepository>(
  'LocationsTraitsRepository',
  LocationsTraitsRepository,
);

container.registerSingleton<IPowersRepository>(
  'PowersRepository',
  PowersRepository,
);

container.registerSingleton<IInfluenceActionRepository>(
  'InfluenceActionRepository',
  InfluenceActionRepository,
);

// for another repository, just duplicate
