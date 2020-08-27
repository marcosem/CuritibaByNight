import { resolve } from 'path';
import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';

interface IUploadReturn {
  // directory: string;
  tmpFolder: string;
  uploadsFolder: string;
  storage: StorageEngine;
}

export default function upload(type: string): IUploadReturn {
  const tmpFolder = resolve(__dirname, '..', '..', 'tmp');
  let uploadsFolder;

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
      break;
    case 'sheet':
      uploadsFolder = resolve(__dirname, '..', '..', 'tmp', 'uploads', 'sheet');
      break;
    default:
      uploadsFolder = resolve(__dirname, '..', '..', 'tmp', 'uploads');
  }

  return {
    tmpFolder,
    uploadsFolder,
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(request, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('hex');
        const fileName = `${fileHash}-${file.originalname.toLowerCase()}`;

        return callback(null, fileName);
      },
    }),
  };
}
