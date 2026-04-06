const imageService = require('../services/imageService');
const fs = require('fs');

// helper to clean up temp files
function cleanup(...paths) {
  paths.forEach(p => {
    if (p && fs.existsSync(p)) {
      try { fs.unlinkSync(p); } catch (e) { /* ignore */ }
    }
  });
}

const removeBg = async (req, res) => {
  let outputPath = null;
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload an image' });
    }

    const result = await imageService.removeBackground(req.file.path);
    outputPath = result.outputPath;

    res.json({
      originalSize: result.originalSize,
      processedSize: result.processedSize,
      file: result.base64,
      format: 'png'
    });
  } catch (err) {
    console.error('Remove BG error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to remove background' });
  } finally {
    cleanup(req.file?.path, outputPath);
  }
};

const compressImage = async (req, res) => {
  let outputPath = null;
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload an image' });
    }

    const quality = parseInt(req.body.quality) || 60;
    const result = await imageService.compressImage(req.file.path, quality);
    outputPath = result.outputPath;

    res.json({
      originalSize: result.originalSize,
      compressedSize: result.compressedSize,
      file: result.base64,
      format: result.format
    });
  } catch (err) {
    console.error('Compress error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to compress image' });
  } finally {
    cleanup(req.file?.path, outputPath);
  }
};

module.exports = { removeBg, compressImage };
