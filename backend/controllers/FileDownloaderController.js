const FansModel = require('../models/FansModel');
const FansPeriodHistoryModel = require('../models/FansPeriodHistoryModel');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const http = require('http');
// const sequelize = require('../util/database');

const getFile = (req, res, next) => {
  const dest = path.join('custom_path', 'filename.extname');
  const uri = req.query.filePath + req.query.fileName;
  http.get(uri, (res) => {
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

const _checkEquityStatus = (data) => {
  console.log('_checkEquityStatus', data);
  const currentDateTimestamp = moment().unix();
  const expireDateTimestamp = moment(data.expireDate).unix();

  //   console.log('data.expireDate+++++', data.expireDate)
  //   console.log('currentDateTimestamp+++++', currentDateTimestamp)
  //   console.log('expireDateTimestamp+++++', expireDateTimestamp)
  const periodTimestamp = data.period * 24 * 3600;
  let result = '';
  if (expireDateTimestamp - periodTimestamp > currentDateTimestamp) {
    result = 'not_started';
  } else if (expireDateTimestamp > currentDateTimestamp && expireDateTimestamp - periodTimestamp < currentDateTimestamp) {
    result = 'in_progress';
  } else if (expireDateTimestamp + periodTimestamp < currentDateTimestamp) {
    result = 'finished';
  }
  return result;
};

const getPeriodHistory = (req, res, next) => {
  const pagination = {
    limit: Number(req.query.limit),
    page: Number(req.query.page),
    offset: req.query.limit * (req.query.page - 1)
  };
  const query = {
    order: [['expireDate', 'DESC']],
    where: {
      fanId: req.query.fanId
    }
  };
  FansPeriodHistoryModel.findAll(Object.assign(query, {}))
    .then(async (data) => {
      res.status(200).json({
        message: 'Created successful',
        total: await FansPeriodHistoryModel.count(),
        data: data.map((item) => {
          return {
            ...item.dataValues,
            equityStatus: _checkEquityStatus(item)
          };
        })
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: 'Failed',
        error
      });
    });
};

const _addFanPeriodHistroyPromise = (req, res, next) => {
  return new Promise((resolve, reject) => {
    FansPeriodHistoryModel.create({
      fanId: req.body.id,
      period: req.body.period,
      expireDate: req.body.expireDate
    })
      .then(async (data) => {
        FansModel.findOne({
          id: req.body.id
        })
          .then(async (data) => {
            data.expireDate = req.body.expireDate;
            await data.save();
            resolve();
          })
          .catch((error) => {
            console.log(error);
            reject();
          });
      })
      .catch((error) => {
        console.log(error);
        reject();
      });
  });
};

exports.getFile = getFile;
exports.deleteFile = deleteFile;
