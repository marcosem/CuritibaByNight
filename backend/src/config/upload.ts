import { resolve } from 'path';
import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';

interface IUploadReturn {
  directory: string;
  storage: StorageEngine;
}

export default function upload(type: string): IUploadReturn {
  let tmpFolder;

  switch (type) {
    case 'avatar':
      tmpFolder = resolve(__dirname, '..', '..', 'tmp', 'avatar');
      break;
    case 'sheet':
      tmpFolder = resolve(__dirname, '..', '..', 'tmp', 'sheet');
      break;
    default:
      tmpFolder = resolve(__dirname, '..', '..', 'tmp');
  }

  return {
    directory: tmpFolder,
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
