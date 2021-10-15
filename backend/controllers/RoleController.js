const express = require('express');
const uuidv1 = require('uuid/v1');
const RoleModel = require('../models/RoleModel');

const getListByPagination = (req, res, next) => {
  let pagination = {};
  let query = {};

  pagination = {
    limit: Number(req.query.limit),
    page: Number(req.query.page),
    offset: req.query.limit * (req.query.page - 1)
  };
  if (req.query.type) {
    query = {
      where: {
        type: req.query.type
      }
    };
  }
  RoleModel.findAll(Object.assign(query, pagination))
    .then(async (response) => {
      console.log('getListByPagination+++++', response);
      res.status(200).json({
        pagination: {
          total: await RoleModel.count()
        },
        data: response
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error,
        req: pagination
      });
    });
};

const getList = (req, res, next) => {
  let query = {};

  RoleModel.findAll(Object.assign(query))
    .then(async (response) => {
      console.log('getListByPagination+++++', response);
      res.status(200).json({
        // pagination: {
        //   total: await RoleModel.count()
        // },
        data: response
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error
      });
    });
};

const createOrUpdate = async (req, res, next) => {
  const id = req.body.id;
  const code = req.body.code;
  console.log('settingId', req.body);
  const ifCodeDuplicated = await _checkIfCodeDuplicated(code);

  if (!id || id === '') {
    if (ifCodeDuplicated === true) {
      res.status(400).json({
        message: '不能定义重复的code'
      });
    }
    RoleModel.create({
      id: uuidv1(),
      name: req.body.name,
      code: req.body.code
    })
      .then(async (result) => {
        console.log('result+++++', result);
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

    RoleModel.findOne({
      where: {
        id
      }
    })
      .then(async (data) => {
        console.log(data);
        data.name = req.body.name;
        data.code = req.body.code;

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

const _checkIfCodeDuplicated = (code) => {
  return new Promise((resolve, reject) => {
    RoleModel.findAll()
      .then((response) => {
        const codeList = response.map((item) => item.toJSON());
        const result = codeList.some((item) => item.code === code);

        resolve(result);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

const deleteItems = (req, res, next) => {
  const id = req.body.id;
  console.log(id instanceof Array);
  if (id instanceof Array) {
    id.forEach((item, index) => {
      RoleModel.findAll({
        where: {
          id: item
        }
      })
        .then(async (response) => {
          response.forEach(async (item2) => {
            const result = await item2.destroy();
            res.status(200).json({
              message: 'Delete successful',
              body: result
            });
          });
        })
        .catch((error) => {
          res.status(500).json({
            message: 'Delete failed',
            error
          });
        });
    });
  } else {
    RoleModel.destroy({
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

exports.getListByPagination = getListByPagination;
exports.getList = getList;
exports.createOrUpdate = createOrUpdate;
exports.deleteItems = deleteItems;
