const FansModel = require('../models/FansModel');
const FansPeriodHistoryModel = require('../models/FansPeriodHistoryModel');
const uuidv1 = require('uuid/v1');
const uuidv4 = require('uuid/v4');
const uuidv5 = require('uuid/v5');
const sequelize = require('../util/database');

const getListByPagination = (req, res, next) => {
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

  FansModel.findAll(Object.assign(query, pagination))
    .then(async (data) => {
      res.status(200).json({
        pagination: {
          total: await FansModel.count()
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

const getFansInfo = (req, res, next) => {
  FansModel.findOne({
    where: {
      id: req.query.id
    }
  })
    .then(async (data) => {
      console.log(data);

      res.status(200).json({
        message: 'Updated successful',
        result: {
          nickName: data.nickName,
          email: data.email,
          phone: data.phone,
          expireDate: data.expireDate,
          period: data.period
        }
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
};

const createOrUpdate = (req, res, next) => {
  const id = req.body.id;
  if (!id || id === '') {
    FansModel.create({
      id: uuidv1(),
      nickName: req.body.nickName,
      email: req.body.email,
      phone: req.body.phone
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

    FansModel.findOne({
      where: {
        id
      }
    })
      .then(async (data) => {
        console.log(data);
        data.nickName = req.body.nickName;
        data.email = req.body.email;
        data.phone = req.body.phone;
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

const deleteItems = (req, res, next) => {
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

const addPeriod = (req, res, next) => {
  FansModel.findOne({
    id: req.body.id
  })
    .then(async (data) => {
      data.expireDate = req.body.expireDate;
      await data.save();
      await _addFanPeriodHistroyPromise(req);
      res.status(200).json({
        message: 'Created successful',
        data
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

const getPeriodHistory = (req, res, next) => {
  FansPeriodHistoryModel.findAll({
    order: [['expireDate', 'DESC']],
    where: {
      fanId: req.query.fanId
    }
  })
    .then(async (data) => {
      res.status(200).json({
        message: 'Created successful',
        data
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
        resolve();
      })
      .catch((error) => {
        console.log(error);
        reject();
      });
  });
};

const deletePeriod = (req, res, next) => {
  const id = req.body.id;
  FansPeriodHistoryModel.destroy({
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
};

exports.getFansInfo = getFansInfo;
exports.createOrUpdate = createOrUpdate;
exports.addPeriod = addPeriod;
exports.getListByPagination = getListByPagination;
exports.deleteItems = deleteItems;
exports.getPeriodHistory = getPeriodHistory;
exports.deletePeriod = deletePeriod;
