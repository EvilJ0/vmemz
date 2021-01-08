import {config} from './config';
import * as path from 'path';
import util = require('util');
import multer = require('multer');
import GridFsStorage = require('multer-gridfs-storage');
import crypto = require('crypto');

const storage = new GridFsStorage({
                                      url    : config.URL,
                                      options: {useNewUrlParser: true, useUnifiedTopology: true},
                                      file   : (req, file) => {
                                          return new Promise((resolve, reject) => {
                                              const match = ["image/png", 'image/gif', 'image/jpeg'];
                                              if(match.indexOf(file.mimetype) !== -1) {
                                                  crypto.randomBytes(16, (err, buf) => {
                                                      if (err) {
                                                          return reject(err);
                                                      }
                                                      const
                                                          filename = buf.toString('hex') + path.extname(file.originalname),
                                                          fileInfo = {
                                                              filename  : filename,
                                                              bucketName: 'uploads'
                                                          };
                                                      resolve(fileInfo);
                                                  });
                                              } else {
                                                  console.log(`unauthorised file !!! `)
                                                  reject(file)
                                              }
                                          });
                                      }
                                  });


export const upload = multer({storage}).single('file');
export const uploadFiles = util.promisify(upload);

