const express = require('express');
const router = express.Router();

const FansController = require('../controllers/FansController');

router.get('/getListByPagination', FansController.getListByPagination);
router.get('/getPeriodHistory', FansController.getPeriodHistory);
router.post('/createOrUpdate', FansController.createOrUpdate);
router.post('/addPeriod', FansController.addPeriod);
router.get('/getFansInfo', FansController.getFansInfo);
router.delete('/deleteItems', FansController.deleteItems);
router.delete('/deletePeriod', FansController.deletePeriod);

module.exports = router;
