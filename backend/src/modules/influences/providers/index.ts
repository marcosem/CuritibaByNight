import { container } from 'tsyringe';
import ICurrentActionMonthProvider from '@modules/influences/providers/CurrentActionMonthProvider/models/ICurrentActionMonthProvider';
import CurrentActionMonthProvider from '@modules/influences/providers/CurrentActionMonthProvider/implementations/CurrentActionMonthProvider';

container.registerSingleton<ICurrentActionMonthProvider>(
  'CurrentActionMonthProvider',
  CurrentActionMonthProvider,
);
