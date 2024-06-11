import { Request } from 'express';
import { HttpException, HttpStatus } from '@nestjs/common';
import { extname } from 'path';
import { diskStorage } from 'multer';

export const imageFileFilter = (
  req: Request,
  file: any,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
    return callback(
      new HttpException('Unsupported file type', HttpStatus.BAD_REQUEST),
      false,
    );
  }

  if (file.size > 1024 * 1024 * 2) {
    return callback(
      new HttpException('File size limit exceeded', HttpStatus.BAD_REQUEST),
      false,
    );
  }

  callback(null, true);
};

export const storageConfig = (destination: string) => {
  return diskStorage({
    destination: destination,
    filename: (req, file, cb) => {
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      cb(null, `${randomName}${extname(file.originalname)}`);
    },
  });
};
