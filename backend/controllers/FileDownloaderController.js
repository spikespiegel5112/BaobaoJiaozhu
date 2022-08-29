const moment = require('moment');
const uuidv1 = require('uuid/v1');
const fs = require('fs');
const path = require('path');
const http = require('http');
const request = require('request');
const FileDownloaderModel = require('../models/FileDownloaderModel');
// const sequelize = require('../util/database');

// http://pp-jgxzq.oss-cn-qingdao.aliyuncs.com/ctzcf_entrance/entrance_
// .jpg
const getSingleFile = (req, res, next) => {
  console.log('getFIle+++++++', req.body);
  const dirPath = path.join(__dirname, '/website');
  const requestPath = req.body.fileUrl;
  const fileNameArr = requestPath.split('/');
  const fileName = fileNameArr[fileNameArr.length];
  console.log('fileNameArr+++++', fileNameArr);
  console.log('fileName+++++', fileName);
  const destFileName = path.join('/website/', 'aaa.jpg');
  const steam = fs.createWriteStream(destFileName);

  request(requestPath, (error, response, body) => {
    console.log('destFileName+++++', destFileName);
    console.log(response);
    console.log('error+++++', error);
  })
    .pipe(steam)
    .on('close', () => {
      res.status(200).json({
        message: 'Operation successful'
      });
    });
};

const getMultipleFile = (req, res, next) => {
  console.log('getFIle+++++++', req.body);
  const filePathArr = req.query.filePath.join('');
  const filePath = filePathArr[filePathArr.length - 1] !== '/' ? filePath + '/' : filePath;
  const dest = path.join(req.query.filePath, req.query.fileName);
  // const uri = req.query.filePath + req.query.fileName;
  http.get(dest, (res) => {
    if (res.statusCode !== 200) {
      console.log(res);
      return;
    }

    res.on('end', () => {
      console.log('finish download');
    });

    // 进度、超时等

    file
      .on('finish', () => {
        file.close();
      })
      .on('error', (err) => {
        fs.unlink(dest);
      });

    res.pipe(file);
  });
};

const getDownloaderInfoByPagination = (req, res, next) => {
  console.log('getListByPagination++++++++++++', req);
  let pagination = {};
  let query = {};
  if (Object.keys(pagination).length > 0) {
    pagination = {
      limit: Number(req.query.limit),
      page: Number(req.query.page),
      offset: req.query.limit * (req.query.page - 1)
    };
  }
  if (req.query.type) {
    query = {
      where: {
        type: req.query.type
      }
    };
  }

  FileDownloaderModel.findAll(Object.assign(query, pagination))
    .then(async (data) => {
      res.status(200).json({
        message: 'Operation successful',
        pagination: {
          total: await FileDownloaderModel.count()
        },
        data
      });
    })
    .catch((error) => {
      res.status(500).json({
        error,
        req: pagination
      });
    });
};

const deleteItems = (req, res, next) => {
  console.log(req.body);
  console.log(req.params);
  const id = req.body.id;

  if (req.body instanceof Array) {
    req.body.forEach((item, index) => {
      FileDownloaderModel.findOne({
        where: {
          id: item.id
        }
      })
        .then(async (response) => {
          const result = await response.destroy();
          if (index + 1 === req.body.length) {
            res.status(200).json({
              message: 'Delete successful',
              body: result
            });
          }
        })
        .catch((error) => {
          res.status(500).json({
            message: 'Delete failed',
            error
          });
        });
    });
  } else {
    FileDownloaderModel.destroy({
      where: {
        id
      }
    })
      .then((result) => {
        console.log('result+++++', result);

        res.status(200).json({
          message: 'Delete successful',
          id
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: 'Delete failed',
          error
        });
      });
  }
};

const deleteFile = (req, res, next) => {
  console.log(req.body);
  console.log(req.params);
  const id = req.body.id;

  if (req.body instanceof Array) {
    req.body.forEach((item, index) => {
      FileDownloaderModel.findOne({
        where: {
          id: item.id
        }
      })
        .then(async (response) => {
          const result = await response.destroy();
          if (index + 1 === req.body.length) {
            res.status(200).json({
              message: 'Delete successful',
              body: result
            });
          }
        })
        .catch((error) => {
          res.status(500).json({
            message: 'Delete failed',
            error
          });
        });
    });
  } else {
    FileDownloaderModel.destroy({
      where: {
        id
      }
    })
      .then((result) => {
        console.log('result+++++', result);

        res.status(200).json({
          message: 'Delete successful',
          id
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: 'Delete failed',
          error
        });
      });
  }
};

const createOrUpdate = (req, res, next) => {
  const id = req.body.id;
  if (!id || id === '') {
    FileDownloaderModel.create({
      id: uuidv1(),
      name: req.body.name,
      type: req.body.type,
      fileNameLeftSide: req.body.fileNameLeftSide,
      fileNameRightSide: req.body.fileNameRightSide,
      seriesNumberStart: req.body.seriesNumberStart,
      seriesNumberEnd: req.body.seriesNumberEnd,
      destDirectory: req.body.destDirectory
    })
      .then(async (result) => {
        console.log('result+++++', result);
        res.status(200).json({
          message: 'Created successful',
          result
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          message: 'Failed',
          error
        });
      });
  } else {
    console.log('id', id);
    console.log('req.body', req.body);

    FileDownloaderModel.findOne({
      where: {
        id
      }
    })
      .then(async (data) => {
        console.log(data);
        data.name = req.body.name;
        data.type = req.body.type;
        data.fileNameLeftSide = req.body.fileNameLeftSide;
        data.fileNameRightSide = req.body.fileNameRightSide;
        data.seriesNumberStart = req.body.seriesNumberStart;
        data.seriesNumberEnd = req.body.seriesNumberEnd;
        await data.save();

        res.status(200).json({
          message: 'Updated successful',
          result: data
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          message: 'Failed',
          req: req.body,
          error
        });
      });
  }
};

exports.getSingleFile = getSingleFile;
exports.deleteFile = deleteFile;
exports.deleteItems = deleteItems;
exports.createOrUpdate = createOrUpdate;
exports.getDownloaderInfoByPagination = getDownloaderInfoByPagination;
