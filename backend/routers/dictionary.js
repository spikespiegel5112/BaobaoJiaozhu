const express = require('express');
const router = express.Router();

const dictionaryController = require('../controllers/dictionaryController');

router.get('/getList', dictionaryController.getList);
router.post('/createOrUpdate', dictionaryController.createOrUpdate);
router.delete('/deleteItem', dictionaryController.deleteItem);


module.exports = router;
