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
    let newWidth: number;
    let newHeight: number;
    let cutX: number;
    let cutY: number;

    const { width, height } = imageData.bitmap;

    if (width < height) {
      newWidth = width;
      newHeight = Math.round((width / propX) * propY);

      cutX = 0;
      cutY = Math.round((height - newHeight) / 2);
    } else if (width > height) {
      newHeight = height;
      newWidth = Math.round((height / propY) * propX);

      cutX = Math.round((width - newWidth) / 2);
      cutY = 0;
    } else if (propX > propY) {
      newWidth = width;
      newHeight = Math.round((height / propX) * propY);

      cutX = 0;
      cutY = Math.round((height - newHeight) / 2);
    } else if (propY > propX) {
      newHeight = height;
      newWidth = Math.round((width / propY) * propX);

      cutX = Math.round((width - newWidth) / 2);
      cutY = 0;
    } else {
      return file;
    }

    const newFileName = `x${file}`;

    imageData
      .crop(cutX, cutY, newWidth, newHeight)
      .write(resolve(path, newFileName));

    return newFileName;
  }
}

export default JimpProvider;
