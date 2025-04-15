import multer, { diskStorage } from 'multer';
import * as fs from 'fs';

fs.mkdirSync(`images`, { recursive: true });

const localStorage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

    const fileExtension = file.originalname.slice(
      file.originalname.indexOf(`.`) + 1,
    );

    cb(null, `local` + '-' + uniqueSuffix + `.${fileExtension}`);
  },
});

export default localStorage;
