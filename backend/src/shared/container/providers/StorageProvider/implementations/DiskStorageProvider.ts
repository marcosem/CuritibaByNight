import fs from 'fs';
import { resolve } from 'path';
import uploadConfig from '@config/upload-old';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

class DiskStorageProvider implements IStorageProvider {
  public async saveFile(file: string): Promise<string> {
    await fs.promises.rename(
      resolve(uploadConfig.tmpFolder, file),
      resolve(uploadConfig.uploadsFolder, file),
    );

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const filePath = resolve(uploadConfig.uploadsFolder, file);

    const fileExists = fs.existsSync(filePath);

    if (fileExists) {
      await fs.promises.unlink(filePath);
    }
  }
}

export default DiskStorageProvider;
