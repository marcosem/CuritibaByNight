import IImageClipper from '@shared/container/providers/ImageClipperProvider/models/IImageClipper';
import jimp from 'jimp';
import { resolve } from 'path';

class JimpProvider implements IImageClipper {
  public async cropImage(
    file: string,
    path: string,
    propX: number,
    propY: number,
  ): Promise<string> {
    const imageData = await jimp.read(resolve(path, file));
    let cutX: number;
    let cutY: number;

    const { width, height } = imageData.bitmap;

    const propXY = propX / propY;
    const propYX = propY / propX;
    const refWidth = Math.round(height * propXY);
    const refHeight = Math.round(width * propYX);

    const newWidth = refWidth < width ? refWidth : width;
    const newHeight = refHeight < height ? refHeight : height;

    if (newWidth < width) {
      cutX = Math.round((width - newWidth) / 2);
    } else {
      cutX = 0;
    }

    if (newHeight < height) {
      cutY = Math.round((height - newHeight) / 2);
    } else {
      cutY = 0;
    }

    const newFileName = `x${file}`;

    if (newWidth > 500 || newHeight > 500) {
      imageData
        .crop(cutX, cutY, newWidth, newHeight)
        .scaleToFit(500, 500)
        .write(resolve(path, newFileName));
    } else {
      imageData
        .crop(cutX, cutY, newWidth, newHeight)
        .write(resolve(path, newFileName));
    }

    return newFileName;
  }
}

export default JimpProvider;
