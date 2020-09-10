import { container } from 'tsyringe';

import IImageClipper from '@shared/container/providers/ImageClipperProvider/models/IImageClipper';
import JimpProvider from '@shared/container/providers/ImageClipperProvider/implementations/JimpProvider';

container.registerSingleton<IImageClipper>(
  'ImageClipperProvider',
  JimpProvider,
);
