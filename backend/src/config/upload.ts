import { resolve } from 'path';
import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';

interface IUploadReturn {
  driver: 'disk' | 's3';
  tmpFolder: string;
  uploadsFolder: string;
  multer: {
    storage: StorageEngine;
  };

  config: {
    disk: '';
    s3: {
      bucket: string;
    };
  };
}

export default function upload(type: string): IUploadReturn {
  const storageDriver = process.env.STORAGE_DRIVER === 's3' ? 's3' : 'disk';
  const driver = storageDriver;

  const tmpFolder = resolve(__dirname, '..', '..', 'tmp');
  let uploadsFolder;
  let bucket;

  switch (type) {
    case 'avatar':
      uploadsFolder = resolve(
        __dirname,
        '..',
        '..',
        'tmp',
        'uploads',
        'avatar',
      );
      bucket = 'img-curitibabynight';
      break;
    case 'assets':
      uploadsFolder = resolve(
        __dirname,
        '..',
        '..',
        'tmp',
        'uploads',
        'assets',
      );
      bucket = 'img-curitibabynight';
      break;
    case 'sheet':
      uploadsFolder = resolve(__dirname, '..', '..', 'tmp', 'uploads', 'sheet');
      bucket = 'sheet-curitibabynight';
      break;
    default:
      uploadsFolder = resolve(__dirname, '..', '..', 'tmp', 'uploads');
      bucket = 'img-curitibabynight';
  }

  return {
    driver,
    tmpFolder,
    uploadsFolder,
    multer: {
      storage: multer.diskStorage({
        destination: tmpFolder,
        filename(request, file, callback) {
          const fileHash = crypto.randomBytes(10).toString('hex');
          const fileName = `${fileHash}-${file.originalname
            .toLowerCase()
            .replace(/\s/g, '')}`;

          return callback(null, fileName);
        },
      }),
    },
    config: {
      disk: '',
      s3: {
        bucket,
      },
    },
  };
}
