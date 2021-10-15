const express = require('express');
const router = express.Router();

const RoleController = require('../controllers/RoleController');

router.get('/getListByPagination', RoleController.getListByPagination);
router.get('/getList', RoleController.getList);
router.post('/createOrUpdate', RoleController.createOrUpdate);
router.delete('/deleteItems', RoleController.deleteItems);

module.exports = router;
