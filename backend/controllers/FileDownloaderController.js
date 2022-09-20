const moment = require('moment');
const uuidv1 = require('uuid/v1');
const fs = require('fs');
const path = require('path');
const http = require('http');
const request = require('request');
const FileDownloaderModel = require('../models/FileDownloaderModel');
// const sequelize = require('../util/database');

// http://pp-jgxzq.oss-cn-qingdao.aliyuncs.com/ctzcf_entrance/entrance_00
// 209
// .jpg
const getSingleFile = (req, res, next) => {
  const requestPath = req.body.fileUrl;
  const fileNameArr = requestPath.split('/');
  const fileName = fileNameArr[fileNameArr.length - 1];
  const destFileName = path.join(req.body.destPath, fileName);
  const steam = fs.createWriteStream(destFileName);
  // index = ('000' + index).slice(-3);
  request(requestPath, (error, response, body) => {
    if (error) {
      console.log('error+++++', error)
      res.status(500).json({
        message: 'Operation failed',
        error
      });
    }
  })
    .pipe(steam)
    .on('close', () => {
      res.status(200).json({
        message: 'Operation successful'
      });
    });
};

const getDownloaderInfoByPagination = (req, res, next) => {
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
      fileUrlLeftSide: req.body.fileUrlLeftSide,
      fileUrlRightSide: req.body.fileUrlRightSide,
      fileUrl: req.body.fileUrlRightSide,
      seriesNumberStart: req.body.seriesNumberStart,
      seriesNumberEnd: req.body.seriesNumberEnd,
      destPath: req.body.destPath
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
        data.fileUrlLeftSide = req.body.fileUrlLeftSide;
        data.fileUrlRightSide = req.body.fileUrlRightSide;
        data.fileUrl = req.body.fileUrl;
        data.seriesNumberStart = req.body.seriesNumberStart;
        data.seriesNumberEnd = req.body.seriesNumberEnd;
        data.destPath = req.body.destPath;
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
