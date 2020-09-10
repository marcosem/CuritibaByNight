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

      if (newHeight > height) {
        newHeight = height;
        cutY = 0;
      } else {
        cutY = Math.round((height - newHeight) / 2);
      }
      cutX = 0;
    } else if (width > height) {
      newHeight = height;
      newWidth = Math.round((height / propY) * propX);

      if (newWidth > width) {
        newWidth = width;
        cutX = 0;
      } else {
        cutX = Math.round((width - newWidth) / 2);
      }
      cutY = 0;
    } else if (propX > propY) {
      newWidth = width;
      newHeight = Math.round((height / propX) * propY);

      if (newHeight > height) {
        newHeight = height;
        cutY = 0;
      } else {
        cutY = Math.round((height - newHeight) / 2);
      }
      cutX = 0;
    } else if (propY > propX) {
      newHeight = height;
      newWidth = Math.round((width / propY) * propX);

      if (newWidth > width) {
        newWidth = width;
        cutX = 0;
      } else {
        cutX = Math.round((width - newWidth) / 2);
      }
      cutY = 0;
    } else {
      return file;
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
