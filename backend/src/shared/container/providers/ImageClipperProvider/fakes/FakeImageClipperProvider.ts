import IImageClipper from '@shared/container/providers/ImageClipperProvider/models/IImageClipper';

class FakeImageClipperProvider implements IImageClipper {
  public async cropImage(file: string): Promise<string> {
    return file;
  }
}

export default FakeImageClipperProvider;
