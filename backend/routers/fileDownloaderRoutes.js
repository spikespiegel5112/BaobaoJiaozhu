const express = require('express');
const router = express.Router();

const FileDownloaderController = require('../controllers/FileDownloaderController');

router.get('/getFile', FileDownloaderController.getFile);
router.delete('/deleteFile', FileDownloaderController.deleteFile);

module.exports = router;
