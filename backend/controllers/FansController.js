const FansModel = require('../models/FansModel');
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

const getVotingOptions = (req, res, next) => {
  const votingId = req.query.votingId;
  _getVotingOptionsPromise(votingId)
    .then((result) => {
      res.status(200).json({
        data: result
      });
    })
    .catch((error) => {
      res.status(500).json({
        error
      });
    });
};



const createOrUpdate = (req, res, next) => {
  const id = req.body.id;
  console.log('settingId', req.body);
  if (!id || id === '') {
    FansModel.create({
      id: uuidv1(),
      name: req.body.name,
      title: req.body.title,
      type: req.body.type,
      isMultiple: req.body.isMultiple
    })
      .then(async (result) => {
        console.log('result+++++', result);
        await _createOrUpdateOptionById(req);

        res.status(200).json({
          message: 'Created successful',
          result
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: 'Failed',
          error
        });
      });
  } else {
    console.log('id', id);

    FansModel.findOne({
      where: {
        id
      }
    })
      .then(async (data) => {
        console.log(data);
        data.name = req.body.name;
        data.title = req.body.title;
        data.isMultiple = req.body.isMultiple;

        await data.save();
        await _createOrUpdateOptionById(req);
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
  console.log(id instanceof Array);
  if (id instanceof Array) {
    id.forEach((item, index) => {
      FansModel.findAll({
        where: {
          id: item
        }
      })
        .then(async (response) => {
          const result = await response.destroy();
          if (index + 1 === req.body.settingId.length) {
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

exports.createOrUpdate = createOrUpdate;
exports.getListByPagination = getListByPagination;
exports.deleteItems = deleteItems;
exports.getVotingOptions = getVotingOptions;
