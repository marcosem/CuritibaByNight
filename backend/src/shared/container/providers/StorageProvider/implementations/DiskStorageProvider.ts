import fs from 'fs';
import { resolve } from 'path';
import uploadConfig from '@config/upload';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

class DiskStorageProvider implements IStorageProvider {
  public async saveFile(file: string, type: string): Promise<string> {
    const upConfig = uploadConfig(type);

    await fs.promises.rename(
      resolve(upConfig.tmpFolder, file),
      resolve(upConfig.uploadsFolder, file),
    );

    return file;
  }

  public async deleteFile(file: string, type: string): Promise<void> {
    const upConfig = uploadConfig(type);
    const filePath = resolve(upConfig.uploadsFolder, file);

    const fileExists = fs.existsSync(filePath);

    if (fileExists) {
      await fs.promises.unlink(filePath);
    }
  }
}

export default DiskStorageProvider;
