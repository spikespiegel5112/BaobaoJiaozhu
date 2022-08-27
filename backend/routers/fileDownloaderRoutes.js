const express = require('express');
const router = express.Router();

const FileDownloaderController = require('../controllers/FileDownloaderController');

router.get('/getFile', FileDownloaderController.getFile);
router.post('/createOrUpdate', FileDownloaderController.createOrUpdate);
router.delete('/deleteFile', FileDownloaderController.deleteFile);

module.exports = router;
