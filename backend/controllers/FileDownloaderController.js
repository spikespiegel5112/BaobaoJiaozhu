const moment = require('moment');
const uuidv1 = require('uuid/v1');
const fs = require('fs');
const path = require('path');
const http = require('http');
const FileDownloaderModel = require('../models/FileDownloaderModel');
// const sequelize = require('../util/database');

// http://pp-jgxzq.oss-cn-qingdao.aliyuncs.com/ctzcf_entrance/entrance_
// .jpg
const getFile = (req, res, next) => {
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

  //   FansModel.findOne({
  //     where: {
  //       id: req.query.id
  //     }
  //   })
  //     .then(async (data) => {
  //       console.log(data);

  //       res.status(200).json({
  //         message: 'Operate successful',
  //         result: {
  //           fileName: data.fileName
  //         }
  //       });
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       res.status(500).json({
  //         message: 'Failed',
  //         req: req.body,
  //         error
  //       });
  //     });
};

const deleteFile = (req, res, next) => {
  console.log(req.body);
  console.log(req.params);
  const id = req.body.id;

  if (req.body instanceof Array) {
    req.body.forEach((item, index) => {
      FansModel.findOne({
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
    FansModel.destroy({
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
      fileNameLeftSide: req.body.fileNameLeftSide,
      fileNameRightSide: req.body.fileNameRightSide,
      seriesNumberStart: req.body.seriesNumberStart,
      seriesNumberEnd: req.body.seriesNumberEnd
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

exports.getFile = getFile;
exports.deleteFile = deleteFile;
exports.createOrUpdate = createOrUpdate;
