const express = require('express');
const router = express.Router();

const CommonController = require('../controllers/CommonController');

router.post('/arrayBufferToBase64', CommonController.arrayBufferToBase64);
router.post('/exportCSV', CommonController.exportCSV);
router.post('/encryptPromise', CommonController.encryptPromise);
router.post('/decrypt', CommonController.decrypt);

module.exports = router;
