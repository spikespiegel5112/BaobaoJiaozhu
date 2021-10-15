const express = require('express');
const router = express.Router();

const testController = require('../controllers/testController');


router.get('/testUrl', testController.testUrl);
router.get('/getDeals', testController.getDeals);
router.get('/getBrands', testController.getBrands);
router.get('/getGifts', testController.getGifts);
router.get('/getHomepageCarousel', testController.getHomepageCarousel);
router.get('/getItineraries', testController.getItineraries);
router.get('/getProducts', testController.getProducts);
router.get('/getShops', testController.getShops);
router.get('/getSplashScreen', testController.getSplashScreen);
router.get('/getTags', testController.getTags);

module.exports = router;
