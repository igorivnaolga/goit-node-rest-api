import multer from 'multer';
import HttpError from '../helpers/HttpError.js';
import path from 'node:path';

const destination = path.resolve('temp');

const storage = multer.diskStorage({
  destination,
  filename: (req, file, callback) => {
    const uniquePrefix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniquePrefix}_${file.originalname}`;
    callback(null, filename);
  },
});

const limits = {
  fileSize: 1024 * 1024 * 5,
};

const fileFilter = (req, file, callback) => {
  const extension = file.originalname.split('.').pop();
  if (extension === 'exe') {
    return callback(HttpError(400, '.exe not allowed extension'));
  }
  callback(null, true);
};

const upload = multer({
  storage,
  limits,
  fileFilter,
});

export default upload;
