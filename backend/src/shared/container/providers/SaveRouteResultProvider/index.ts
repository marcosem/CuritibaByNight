import { container } from 'tsyringe';

import ISaveRouteResultProvider from '@shared/container/providers/SaveRouteResultProvider/models/ISaveRouteResultProvider';
import SaveRouteResultProvider from '@shared/container/providers/SaveRouteResultProvider/implementations/SaveRouteResultProvider';

container.registerSingleton<ISaveRouteResultProvider>(
  'SaveRouteResultProvider',
  SaveRouteResultProvider,
);
