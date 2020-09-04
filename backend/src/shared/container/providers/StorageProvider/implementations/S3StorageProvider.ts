import fs from 'fs';
import { resolve } from 'path';
import mime from 'mime';
import aws, { S3 } from 'aws-sdk';
import uploadConfig from '@config/upload';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

class S3StorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new aws.S3({
      region: 'us-east-2',
    });
  }

  public async saveFile(file: string, type: string): Promise<string> {
    const upConfig = uploadConfig(type);
    const originalPath = resolve(upConfig.tmpFolder, file);

    const fileContent = await fs.promises.readFile(originalPath);

    const contentType = mime.getType(originalPath);

    if (!contentType) {
      throw new Error('File not found');
    }

    const { bucket } = uploadConfig(type).config.s3;

    await this.client
      .putObject({
        Bucket: bucket,
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        ContentType: contentType,
      })
      .promise();

    if (originalPath) {
      await fs.promises.unlink(originalPath);
    }

    return file;
  }

  public async deleteFile(file: string, type: string): Promise<void> {
    const { bucket } = uploadConfig(type).config.s3;

    await this.client
      .deleteObject({
        Bucket: bucket,
        Key: file,
      })
      .promise();
  }
}

export default S3StorageProvider;
