const express = require('express');
const router = express.Router();

const FileDownloaderController = require('../controllers/FileDownloaderController');

router.post('/getSingleFile', FileDownloaderController.getSingleFile);
router.get('/getDownloaderInfoByPagination', FileDownloaderController.getDownloaderInfoByPagination);
router.post('/createOrUpdate', FileDownloaderController.createOrUpdate);
router.delete('/deleteFile', FileDownloaderController.deleteFile);
router.delete('/deleteItems', FileDownloaderController.deleteItems);

module.exports = router;
