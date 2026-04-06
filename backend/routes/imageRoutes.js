const express = require('express');
const router = express.Router();
const { imageUpload } = require('../middlewares/upload');
const imageController = require('../controllers/imageController');

router.post('/remove-bg', imageUpload.single('image'), imageController.removeBg);
router.post('/compress', imageUpload.single('image'), imageController.compressImage);

module.exports = router;
