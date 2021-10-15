const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController');

router.post('/createOrUpdate', UserController.createOrUpdate);
router.get('/getListByPagination', UserController.getListByPagination);
router.delete('/deleteItems', UserController.deleteItems);
router.get('/getUserInfo', UserController.getUserInfo);
router.post('/login', UserController.login);
router.post('/register', UserController.register);
router.post('/logout', UserController.logout);

module.exports = router;
