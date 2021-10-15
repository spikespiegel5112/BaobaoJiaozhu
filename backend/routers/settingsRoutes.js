const express = require('express');
const router = express.Router();

const SettingsController = require('../controllers/SettingsController');

router.get('/getList', SettingsController.getList);
router.post('/createOrUpdate', SettingsController.createOrUpdate);
router.delete('/deleteItems', SettingsController.deleteItems);

module.exports = router;
