const express = require('express');
const router = express.Router();
const { pdfUpload } = require('../middlewares/upload');
const pdfController = require('../controllers/pdfController');

router.post('/merge', pdfUpload.array('pdfs', 10), pdfController.mergePdfs);
router.post('/split', pdfUpload.single('pdf'), pdfController.splitPdf);
router.post('/compress', pdfUpload.single('pdf'), pdfController.compressPdf);
router.post('/page-count', pdfUpload.single('pdf'), pdfController.getPageCount);

module.exports = router;
